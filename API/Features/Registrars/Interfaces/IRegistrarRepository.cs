using API.Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Registrars {

    public interface IRegistrarRepository : IRepository<Registrar> {

        Task<IEnumerable<RegistrarListVM>> GetAsync();
        Task<IEnumerable<RegistrarActiveVM>> GetActiveAsync();
        Task<Registrar> GetByIdAsync(int id, bool includeTables);

    }

}