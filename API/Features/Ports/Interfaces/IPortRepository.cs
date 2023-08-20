using API.Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Ports {

    public interface IPortRepository : IRepository<Port> {

        Task<IEnumerable<PortListVM>> GetAsync();
        Task<IEnumerable<PortActiveVM>> GetActiveAsync();
        Task<Port> GetByIdAsync(int id);

    }

}