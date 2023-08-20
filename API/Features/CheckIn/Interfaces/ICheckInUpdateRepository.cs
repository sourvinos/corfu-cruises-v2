using API.Features.Reservations;
using API.Infrastructure.Interfaces;
using System;

namespace API.Features.CheckIn {

    public interface ICheckInUpdateRepository : IRepository<Reservation> {

        void Update(Guid reservationId, Reservation reservation);

    }

}