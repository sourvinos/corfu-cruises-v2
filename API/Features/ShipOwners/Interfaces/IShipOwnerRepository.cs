using API.Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.ShipOwners {

    public interface IShipOwnerRepository : IRepository<ShipOwner> {

        Task<IEnumerable<ShipOwnerListVM>> GetAsync();
        Task<IEnumerable<ShipOwnerActiveVM>> GetActiveAsync();
        Task<ShipOwner> GetByIdAsync(int id);

    }

}