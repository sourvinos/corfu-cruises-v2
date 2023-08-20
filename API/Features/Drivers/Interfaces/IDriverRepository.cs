using API.Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Drivers {

    public interface IDriverRepository : IRepository<Driver> {

        Task<IEnumerable<DriverListVM>> GetAsync();
        Task<IEnumerable<DriverActiveVM>> GetActiveAsync();
        Task<Driver> GetByIdAsync(int id);

    }

}