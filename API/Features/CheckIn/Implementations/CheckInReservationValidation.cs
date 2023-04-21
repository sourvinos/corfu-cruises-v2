using System;
using System.Linq;
using API.Features.Availability;
using API.Features.PickupPoints;
using API.Features.Reservations;
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

namespace API.Features.CheckIn {

    public class CheckInReservationValidation : Repository<Reservation>, ICheckInReservationValidation {

        private readonly IHttpContextAccessor httpContext;
        private readonly UserManager<UserExtended> userManager;

        public CheckInReservationValidation(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> testingEnvironment, UserManager<UserExtended> userManager) : base(context, httpContext, testingEnvironment) {
            this.httpContext = httpContext;
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

        public int GetPortIdFromPickupPointId(Reservation reservation) {
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

        public int IsValid(Reservation reservation, IScheduleRepository scheduleRepo) {
            return true switch {
                var x when x == SimpleUserCanNotAddReservationAfterDeparture(reservation) => 431,
                _ => 200,
            };
        }

        private bool SimpleUserCanNotAddReservationAfterDeparture(Reservation reservation) {
            return !Identity.IsUserAdmin(httpContext) && IsAfterDeparture(reservation);
        }

        private bool IsAfterDeparture(Reservation reservation) {
            var timeNow = DateHelpers.GetLocalDateTime();
            var departureTime = GetScheduleDepartureTime(reservation);
            return DateTime.Compare(timeNow, departureTime) > 0;
        }

        private DateTime GetScheduleDepartureTime(Reservation reservation) {
            var portId = GetPortIdFromPickupPointId(reservation).ToString();
            var schedule = context.Schedules
                .AsNoTracking()
                .Where(x => x.Date == reservation.Date && x.DestinationId == reservation.DestinationId && x.PortId.ToString() == portId)
                .SingleOrDefault();
            var departureTime = schedule.Date.ToString("yyyy-MM-dd") + " " + schedule.Time;
            var departureTimeAsDate = DateTime.Parse(departureTime);
            return departureTimeAsDate;
        }

    }

}