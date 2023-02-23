using System;
using API.Infrastructure.Interfaces;

namespace API.Features.Reservations {

    public interface IReservationUpdateRepository : IRepository<Reservation> {

        void Update(Guid reservationId, Reservation reservation);
        void AssignToDriver(int driverId, string[] ids);
        void AssignToShip(int shipId, string[] ids);
        string AssignRefNoToNewDto(ReservationWriteDto reservation);
 
    }

}