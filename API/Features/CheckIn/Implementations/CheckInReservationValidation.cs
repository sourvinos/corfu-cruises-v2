using System;
using System.Linq;
using API.Features.PickupPoints;
using API.Features.Reservations;
using API.Features.Schedules;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.CheckIn {

    public class CheckInReservationValidation : Repository<Reservation>, ICheckInReservationValidation {

        // private readonly IHttpContextAccessor httpContext;
        // private readonly UserManager<UserExtended> userManager;

        public CheckInReservationValidation(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> testingEnvironment) : base(context, httpContext, testingEnvironment) {
            // this.httpContext = httpContext;
            // this.userManager = userManager;
        }

        public int GetPortIdFromPickupPointId(ReservationWriteDto reservation) {
            PickupPoint pickupPoint = context.PickupPoints
                .AsNoTracking()
                .Include(x => x.CoachRoute)
                .SingleOrDefault(x => x.Id == reservation.PickupPointId);
            return pickupPoint != null ? pickupPoint.CoachRoute.PortId : 0;
        }

        public int IsValid(ReservationWriteDto reservation, IScheduleRepository scheduleRepo) {
            return true switch {
                var x when x == SimpleUserCanNotAddReservationAfterDeparture(reservation) => 431,
                _ => 200,
            };
        }

        private bool IsAfterDeparture(ReservationWriteDto reservation) {
            var timeNow = DateHelpers.GetLocalDateTime();
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

        private bool SimpleUserCanNotAddReservationAfterDeparture(ReservationWriteDto reservation) {
            return IsAfterDeparture(reservation);
        }


    }

}