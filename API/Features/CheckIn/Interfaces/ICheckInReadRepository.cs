using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Interfaces;

namespace API.Features.CheckIn {

    public interface ICheckInReadRepository : IRepository<Reservation> {

        Task<Reservation> GetByCriteriaAsync(string date, int destinationId, string refNo, string ticketNo, string lastname, string firstname);

    }

}