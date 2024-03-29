using API.Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Destinations {

    public interface IDestinationRepository : IRepository<Destination> {

        Task<IEnumerable<DestinationListVM>> GetAsync();
        Task<IEnumerable<DestinationActiveVM>> GetActiveAsync();
        Task<Destination> GetByIdAsync(int id);

    }

}