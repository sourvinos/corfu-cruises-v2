using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Nationalities {

    public interface INationalityRepository : IRepository<Nationality> {

        Task<IEnumerable<NationalityListVM>> GetAsync();
        Task<IEnumerable<NationalityActiveVM>> GetActiveAsync();
        Task<Nationality> GetByIdAsync(int id);

    }

}