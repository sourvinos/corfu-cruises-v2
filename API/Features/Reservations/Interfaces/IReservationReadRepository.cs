using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Reservations {

    public interface IReservationReadRepository : IRepository<Reservation> {

        Task<IEnumerable<ReservationListVM>> GetByDateAsync(string date);
        Task<IEnumerable<ReservationListVM>> GetByRefNoAsync(string refNo);
        Task<ReservationDriverGroupVM> GetByDateAndDriverAsync(string date, int driverId);
        Task<Reservation> GetByIdAsync(string reservationId, bool includeTables);

    }

}