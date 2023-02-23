using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Registrars {

    public interface IRegistrarRepository : IRepository<Registrar> {

        Task<IEnumerable<RegistrarListVM>> GetAsync();
        Task<IEnumerable<RegistrarActiveVM>> GetActiveAsync();
        Task<Registrar> GetByIdAsync(int id, bool includeTables);

    }

}