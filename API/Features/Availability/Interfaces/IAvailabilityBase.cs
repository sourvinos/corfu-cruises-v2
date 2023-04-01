using System.Collections.Generic;
using API.Features.Schedules;
using API.Infrastructure.Interfaces;

namespace API.Features.Availability {

    public interface IAvailabilityBase : IRepository<Schedule> {

        IEnumerable<AvailabilityGroupVM> GetPaxPerPort(IEnumerable<AvailabilityGroupVM> schedule, IEnumerable<ReservationVM> reservations);
        IEnumerable<AvailabilityGroupVM> CalculateOverbookingPerPort(IEnumerable<AvailabilityGroupVM> schedules);
        IEnumerable<AvailabilityGroupVM> CalculateFreePaxPerShip(IEnumerable<AvailabilityGroupVM> schedules);
        IEnumerable<AvailabilityGroupVM> CheckToPatchAllPortsWithZeroFreePax(IEnumerable<AvailabilityGroupVM> schedules);

    }

}