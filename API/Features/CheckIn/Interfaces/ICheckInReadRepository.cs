using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Interfaces;

namespace API.Features.CheckIn {

    public interface ICheckInReadRepository : IRepository<Reservation> {

        Task<Reservation> GetByRefNoAsync(string refNo);
        Task<Reservation> GetByTicketNoAsync(string ticketNo);
        Task<Reservation> GetByDateAsync(string date, int destinationId, string lastname, string firstname);

    }

}