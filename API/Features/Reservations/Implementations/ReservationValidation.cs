using System;
using System.Linq;
using API.Features.PickupPoints;
using API.Features.Schedules;
using API.Features.Users;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Reservations {

    public class ReservationValidation : Repository<Reservation>, IReservationValidation {

        private readonly IHttpContextAccessor httpContext;
        private readonly TestingEnvironment testingEnvironment;
        private readonly UserManager<UserExtended> userManager;

        public ReservationValidation(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> testingEnvironment, UserManager<UserExtended> userManager) : base(context, httpContext, testingEnvironment) {
            this.httpContext = httpContext;
            this.testingEnvironment = testingEnvironment.Value;
            this.userManager = userManager;
        }

        public bool IsUserOwner(int customerId) {
            var userId = Identity.GetConnectedUserId(httpContext);
            var userDetails = Identity.GetConnectedUserDetails(userManager, userId);
            return userDetails.CustomerId == customerId;
        }

        public bool IsKeyUnique(ReservationWriteDto reservation) {
            return !context.Reservations
                .AsNoTracking()
                .Any(x =>
                    x.Date == Convert.ToDateTime(reservation.Date) &&
                    x.ReservationId != reservation.ReservationId &&
                    x.DestinationId == reservation.DestinationId &&
                    x.CustomerId == reservation.CustomerId &&
                    string.Equals(x.TicketNo, reservation.TicketNo, StringComparison.OrdinalIgnoreCase));
        }

        public int GetPortIdFromPickupPointId(ReservationWriteDto reservation) {
            PickupPoint pickupPoint = context.PickupPoints
                .AsNoTracking()
                .Include(x => x.CoachRoute)
                .SingleOrDefault(x => x.Id == reservation.PickupPointId);
            return pickupPoint != null ? pickupPoint.CoachRoute.PortId : 0;
        }

        public bool IsOverbooked(string date, int destinationId) {
            int maxPassengersForAllPorts = context.Schedules
                .AsNoTracking()
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId)
                .Sum(x => x.MaxPax);
            int totalPaxFromAllPorts = context.Reservations
                .AsNoTracking()
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId)
                .Sum(x => x.TotalPax);
            return totalPaxFromAllPorts > maxPassengersForAllPorts;
        }

        public int IsValid(ReservationWriteDto reservation, IScheduleRepository scheduleRepo) {
            return true switch {
                var x when x == !IsKeyUnique(reservation) => 409,
                var x when x == !IsValidCustomer(reservation) => 450, // OK
                var x when x == !IsValidDestination(reservation) => 451, // OK
                var x when x == !IsValidPickupPoint(reservation) => 452, // OK
                var x when x == !IsValidDriver(reservation) => 453, // OK
                var x when x == !IsValidShip(reservation) => 454, // OK
                var x when x == !IsValidNationality(reservation) => 456, // OK
                var x when x == !IsValidGender(reservation) => 457, // OK
                var x when x == !IsCorrectPassengerCount(reservation) => 455, // OK
                var x when x == !PortHasDepartureForDateAndDestination(reservation) => 410, // OK
                var x when x == !SimpleUserHasGivenCorrectCustomerId(reservation) => 413, // Applies only to backend
                var x when x == IsSimpleUserCausingOverbooking(reservation) => 433, // OK
                var x when x == SimpleUserHasNightRestrictions(reservation) => 459, // OK
                var x when x == SimpleUserCanNotAddReservationAfterDeparture(reservation) => 431, // OK
                _ => 200,
            };
        }

        private bool PortHasDepartureForDateAndDestination(ReservationWriteDto reservation) {
            var schedule = context.Schedules
                .AsNoTracking()
                .Where(x => x.Date.ToString() == reservation.Date && x.DestinationId == reservation.DestinationId && x.PortId == GetPortIdFromPickupPointId(reservation) && x.IsActive)
                .ToList();
            return schedule.Count != 0;
        }

        private bool IsSimpleUserCausingOverbooking(ReservationWriteDto reservation) {
            if (Identity.IsUserAdmin(httpContext) || reservation.ReservationId != Guid.Empty) {
                return false;
            } else {
                // var freePax = availabilityDay.CalculateAccumulatedFreePaxPerPort(availabilityDay.CalculateAccumulatedMaxPaxPerPort(availabilityDay.CalculateAccumulatedPaxPerPort(availabilityDay.GetPaxPerPort(availabilityDay.GetForDay(reservation.Date, reservation.DestinationId, GetPortIdFromPickupPointId(reservation)), availabilityDay.GetReservations(reservation.Date))))).LastOrDefault().Destinations.LastOrDefault().Ports.LastOrDefault().AccumulatedFreePax;
                var freePax = 0;
                return freePax < reservation.Adults + reservation.Kids + reservation.Free;
            }
        }

        private bool SimpleUserCanNotAddReservationAfterDeparture(ReservationWriteDto reservation) {
            return !Identity.IsUserAdmin(httpContext) && IsAfterDeparture(reservation);
        }

        private bool IsValidCustomer(ReservationWriteDto reservation) {
            if (reservation.ReservationId == Guid.Empty) {
                return context.Customers
                    .AsNoTracking()
                    .SingleOrDefault(x => x.Id == reservation.CustomerId && x.IsActive) != null;
            }
            return context.Customers
                .AsNoTracking()
                .SingleOrDefault(x => x.Id == reservation.CustomerId) != null;
        }

        private bool IsValidDestination(ReservationWriteDto reservation) {
            if (reservation.ReservationId == Guid.Empty) {
                return context.Destinations
                    .AsNoTracking()
                    .SingleOrDefault(x => x.Id == reservation.DestinationId && x.IsActive) != null;
            }
            return context.Destinations
                .AsNoTracking()
                .SingleOrDefault(x => x.Id == reservation.DestinationId) != null;
        }

        private bool IsValidPickupPoint(ReservationWriteDto reservation) {
            if (reservation.ReservationId == Guid.Empty) {
                return context.PickupPoints
                    .AsNoTracking()
                    .SingleOrDefault(x => x.Id == reservation.PickupPointId && x.IsActive) != null;
            }
            return context.PickupPoints
                .AsNoTracking()
                .SingleOrDefault(x => x.Id == reservation.PickupPointId) != null;
        }

        private bool IsValidDriver(ReservationWriteDto reservation) {
            if (reservation.DriverId != null && reservation.DriverId != 0) {
                if (reservation.ReservationId == Guid.Empty) {
                    var driver = context.Drivers
                        .AsNoTracking()
                        .SingleOrDefault(x => x.Id == reservation.DriverId && x.IsActive);
                    if (driver == null)
                        return false;
                } else {
                    var driver = context.Drivers
                        .AsNoTracking()
                        .SingleOrDefault(x => x.Id == reservation.DriverId);
                    if (driver == null)
                        return false;
                }
            }
            return true;
        }

        private bool IsValidShip(ReservationWriteDto reservation) {
            if (reservation.ShipId != null && reservation.ShipId != 0) {
                if (reservation.ReservationId == Guid.Empty) {
                    var ship = context.Ships
                        .AsNoTracking()
                        .SingleOrDefault(x => x.Id == reservation.ShipId && x.IsActive);
                    if (ship == null)
                        return false;
                } else {
                    var ship = context.Ships
                        .AsNoTracking()
                        .SingleOrDefault(x => x.Id == reservation.ShipId);
                    if (ship == null)
                        return false;
                }
            }
            return true;
        }

        private static bool IsCorrectPassengerCount(ReservationWriteDto reservation) {
            if (reservation.Passengers != null) {
                if (reservation.Passengers.Count != 0) {
                    return reservation.Passengers.Count <= reservation.Adults + reservation.Kids + reservation.Free;
                }
            }
            return true;
        }

        private bool IsValidNationality(ReservationWriteDto reservation) {
            if (reservation.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in reservation.Passengers) {
                    if (reservation.ReservationId == Guid.Empty) {
                        isValid = context.Nationalities
                            .AsNoTracking()
                            .SingleOrDefault(x => x.Id == passenger.NationalityId && x.IsActive) != null;
                    } else {
                        isValid = context.Nationalities
                            .AsNoTracking()
                            .SingleOrDefault(x => x.Id == passenger.NationalityId) != null;
                    }
                }
                return reservation.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool IsValidGender(ReservationWriteDto reservation) {
            if (reservation.Passengers != null) {
                bool isValid = false;
                foreach (var passenger in reservation.Passengers) {
                    if (reservation.ReservationId == Guid.Empty) {
                        isValid = context.Genders
                        .AsNoTracking()
                        .SingleOrDefault(x => x.Id == passenger.GenderId && x.IsActive) != null;
                    } else {
                        isValid = context.Genders
                            .AsNoTracking()
                            .SingleOrDefault(x => x.Id == passenger.GenderId) != null;
                    }
                }
                return reservation.Passengers.Count == 0 || isValid;
            }
            return true;
        }

        private bool SimpleUserHasGivenCorrectCustomerId(ReservationWriteDto reservation) {
            if (!Identity.IsUserAdmin(httpContext)) {
                var simpleUser = Identity.GetConnectedUserId(httpContext);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser);
                if (connectedUserDetails.CustomerId == reservation.CustomerId) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }

        private bool SimpleUserHasNightRestrictions(ReservationWriteDto reservation) {
            if (!Identity.IsUserAdmin(httpContext) && reservation.ReservationId == Guid.Empty) {
                if (HasTransfer(reservation.PickupPointId)) {
                    if (IsForTomorrow(reservation)) {
                        if (IsBetweenClosingTimeAndMidnight(reservation)) {
                            return true;
                        }
                    }
                    if (IsForToday(reservation)) {
                        if (IsBetweenMidnightAndDeparture(reservation)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        private bool HasTransfer(int pickupPointId) {
            var pickupPoint = context.PickupPoints
                .AsNoTracking()
                .Include(x => x.CoachRoute)
                .SingleOrDefault(x => x.Id == pickupPointId);
            return pickupPoint.CoachRoute.HasTransfer;
        }

        private bool IsForTomorrow(ReservationWriteDto reservation) {
            var tomorrow = testingEnvironment.IsTesting ? reservation.Now.AddDays(1) : DateHelpers.GetLocalDateTime().AddDays(1);
            var tomorrowDate = DateHelpers.DateToISOString(tomorrow);
            return reservation.Date == tomorrowDate;
        }

        private bool IsForToday(ReservationWriteDto reservation) {
            var today = testingEnvironment.IsTesting ? reservation.Now : DateHelpers.GetLocalDateTime();
            var todayDate = DateHelpers.DateToISOString(today);
            return reservation.Date == todayDate;
        }

        private bool IsBetweenClosingTimeAndMidnight(ReservationWriteDto reservation) {
            var timeNow = testingEnvironment.IsTesting ? reservation.Now.TimeOfDay : DateHelpers.GetLocalDateTime().TimeOfDay;
            return timeNow.Hours >= 22;
        }

        private bool IsBetweenMidnightAndDeparture(ReservationWriteDto reservation) {
            var timeNow = testingEnvironment.IsTesting ? reservation.Now : DateHelpers.GetLocalDateTime();
            var departureTime = GetScheduleDepartureTime(reservation);
            return DateTime.Compare(timeNow, departureTime) < 0;
        }

        private bool IsAfterDeparture(ReservationWriteDto reservation) {
            var timeNow = testingEnvironment.IsTesting ? reservation.Now : DateHelpers.GetLocalDateTime();
            var departureTime = GetScheduleDepartureTime(reservation);
            return DateTime.Compare(timeNow, departureTime) > 0;
        }

        private DateTime GetScheduleDepartureTime(ReservationWriteDto reservation) {
            var portId = GetPortIdFromPickupPointId(reservation).ToString();
            var schedule = context.Schedules
                .AsNoTracking()
                .Where(x => x.Date.ToString() == reservation.Date && x.DestinationId == reservation.DestinationId && x.PortId.ToString() == portId)
                .SingleOrDefault();
            var departureTime = schedule.Date.ToString("yyyy-MM-dd") + " " + schedule.Time;
            var departureTimeAsDate = DateTime.Parse(departureTime);
            return departureTimeAsDate;
        }

    }

}