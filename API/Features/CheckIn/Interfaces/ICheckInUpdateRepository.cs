using System;
using API.Features.Reservations;
using API.Infrastructure.Interfaces;

namespace API.Features.CheckIn {

    public interface ICheckInUpdateRepository : IRepository<Reservation> {

        void Update(Guid reservationId, Reservation reservation);

    }

}