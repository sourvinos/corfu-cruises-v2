using API.Features.Schedules;
using API.Infrastructure.Interfaces;
using System.Collections.Generic;

namespace API.Features.Availability {

    public interface IAvailabilityCalendar : IRepository<Schedule> {

        IEnumerable<ReservationVM> GetReservations(string fromDate, string toDate);
        IEnumerable<AvailabilityGroupVM> GetSchedule(string fromDate, string toDate);
        IEnumerable<AvailabilityGroupVM> AddBatchId(IEnumerable<AvailabilityGroupVM> schedule);
        IEnumerable<AvailabilityGroupVM> GetPaxPerPort(IEnumerable<AvailabilityGroupVM> schedule, IEnumerable<ReservationVM> reservations);
        IEnumerable<AvailabilityGroupVM> CalculateFreePax(IEnumerable<AvailabilityGroupVM> schedules);

    }

}