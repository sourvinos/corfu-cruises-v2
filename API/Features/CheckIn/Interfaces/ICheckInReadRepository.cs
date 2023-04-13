using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Interfaces;

namespace API.Features.CheckIn {

    public interface ICheckInReadRepository : IRepository<Reservation> {

        Task<Reservation> GetByCriteriaAsync(string refNo, string ticketNo, string date, int destinationId, string lastname, string firstname);

    }

}