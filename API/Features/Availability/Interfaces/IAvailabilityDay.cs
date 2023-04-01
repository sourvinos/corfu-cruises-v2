using System.Collections.Generic;
using API.Features.Schedules;
using API.Infrastructure.Interfaces;

namespace API.Features.Availability {

    public interface IAvailabilityDay :IAvailabilityBase, IRepository<Schedule> {

        IEnumerable<AvailabilityGroupVM> GetForDay(string date, int destinationId);
        IEnumerable<ReservationVM> GetReservations(string date);

    }

}