using API.Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Ships {

    public interface IShipRepository : IRepository<Ship> {

        Task<IEnumerable<ShipListVM>> GetAsync();
        Task<IEnumerable<ShipActiveVM>> GetActiveAsync();
        Task<Ship> GetByIdAsync(int id, bool includeTables);

    }

}