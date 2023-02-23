using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.CoachRoutes {

    public interface ICoachRouteRepository : IRepository<CoachRoute> {

        Task<IEnumerable<CoachRouteListVM>> Get();
        Task<IEnumerable<CoachRouteActiveVM>> GetActive();
        Task<CoachRoute> GetById(int id, bool includeTables);

    }

}