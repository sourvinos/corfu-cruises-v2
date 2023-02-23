using System.Collections.Generic;
using API.Features.Schedules;
using API.Infrastructure.Interfaces;

namespace API.Features.Availability {

    public interface IAvailabilityCalendar : IAvailabilityBase, IRepository<Schedule> {

        IEnumerable<AvailabilityGroupVM> GetForCalendar(int year);
        IEnumerable<ReservationVM> GetReservations(int year);

    }

}