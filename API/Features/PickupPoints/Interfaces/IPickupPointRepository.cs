using API.Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.PickupPoints {

    public interface IPickupPointRepository : IRepository<PickupPoint> {

        Task<IEnumerable<PickupPointListVM>> GetAsync();
        Task<IEnumerable<PickupPointActiveVM>> GetActiveAsync();
        Task<PickupPoint> GetByIdAsync(int id, bool includeTables);

    }

}