using System.Collections.Generic;
using API.Features.Schedules;
using API.Infrastructure.Interfaces;

namespace API.Features.Availability {

    public interface IAvailabilityDay :IAvailabilityBase, IRepository<Schedule> {

        IEnumerable<AvailabilityGroupVM> GetForDay(string date, int destinationId, int portId);
        IEnumerable<ReservationVM> GetReservations(string date);

    }

}