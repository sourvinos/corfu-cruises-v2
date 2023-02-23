using System.Collections.Generic;
using API.Features.Schedules;
using API.Infrastructure.Interfaces;

namespace API.Features.Availability {

    public interface IAvailabilityBase : IRepository<Schedule> {

        IEnumerable<AvailabilityGroupVM> CalculateAccumulatedMaxPaxPerPort(IEnumerable<AvailabilityGroupVM> schedules);
        IEnumerable<AvailabilityGroupVM> GetPaxPerPort(IEnumerable<AvailabilityGroupVM> schedule, IEnumerable<ReservationVM> reservations);
        IEnumerable<AvailabilityGroupVM> CalculateAccumulatedPaxPerPort(IEnumerable<AvailabilityGroupVM> schedules);
        IEnumerable<AvailabilityGroupVM> CalculateAccumulatedFreePaxPerPort(IEnumerable<AvailabilityGroupVM> schedules);

    }

}