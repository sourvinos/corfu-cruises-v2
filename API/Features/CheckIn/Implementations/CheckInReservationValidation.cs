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

        public CheckInReservationValidation(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> testingEnvironment) : base(context, httpContext, testingEnvironment) { }

        public int GetPortIdFromPickupPointId(int pickupPointId) {
            PickupPoint pickupPoint = context.PickupPoints
                .AsNoTracking()
                .Include(x => x.CoachRoute)
                .SingleOrDefault(x => x.Id == pickupPointId);
            return pickupPoint != null ? pickupPoint.CoachRoute.PortId : 0;
        }

        public int IsValid(Reservation reservation, IScheduleRepository scheduleRepo) {
            return true switch {
                var x when x == CheckInNotAllowedAfterDeparture(DateHelpers.DateToISOString(reservation.Date), reservation.DestinationId, reservation.PickupPointId) => 402,
                _ => 200,
            };
        }

        public int IsValid(ReservationWriteDto reservation, IScheduleRepository scheduleRepo) {
            return true switch {
                var x when x == CheckInNotAllowedAfterDeparture(reservation.Date, reservation.DestinationId, reservation.PickupPointId) => 431,
                _ => 200,
            };
        }

        private bool CheckInNotAllowedAfterDeparture(string date, int destinationId, int pickupPointId) {
            return IsAfterDeparture(date, destinationId, pickupPointId);
        }

        private bool IsAfterDeparture(string date, int destinationId, int pickupPointId) {
            var timeNow = DateHelpers.GetLocalDateTime();
            var departureTime = GetScheduleDepartureTime(date, destinationId, pickupPointId);
            return DateTime.Compare(timeNow, departureTime) > 0;
        }

        private DateTime GetScheduleDepartureTime(string date, int destinationId, int pickupPointId) {
            var portId = GetPortIdFromPickupPointId(pickupPointId).ToString();
            var schedule = context.Schedules
                .AsNoTracking()
                .Where(x => x.Date.ToString() == date && x.DestinationId == destinationId && x.PortId.ToString() == portId)
                .SingleOrDefault();
            var departureTime = schedule.Date.ToString("yyyy-MM-dd") + " " + schedule.Time;
            var departureTimeAsDate = DateTime.Parse(departureTime);
            return departureTimeAsDate;
        }

    }

}