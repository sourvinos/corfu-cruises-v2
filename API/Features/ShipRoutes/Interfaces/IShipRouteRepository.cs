using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.ShipRoutes {

    public interface IShipRouteRepository : IRepository<ShipRoute> {

        Task<IEnumerable<ShipRouteListVM>> GetAsync();
        Task<IEnumerable<ShipRouteActiveVM>> GetActiveAsync();
        Task<ShipRoute> GetByIdAsync(int id);

    }

}