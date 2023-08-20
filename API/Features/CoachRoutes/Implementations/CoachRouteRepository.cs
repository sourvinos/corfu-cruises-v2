using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Features.CoachRoutes {

    public class CoachRouteRepository : Repository<CoachRoute>, ICoachRouteRepository {

        private readonly IMapper mapper;

        public CoachRouteRepository(AppDbContext context, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(context, httpContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<CoachRouteListVM>> Get() {
            var coachRoutes = await context.CoachRoutes
                .AsNoTracking()
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<CoachRoute>, IEnumerable<CoachRouteListVM>>(coachRoutes);
        }

        public async Task<IEnumerable<CoachRouteActiveVM>> GetActive() {
            var coachRoutes = await context.CoachRoutes
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Abbreviation)
                .ToListAsync();
            return mapper.Map<IEnumerable<CoachRoute>, IEnumerable<CoachRouteActiveVM>>(coachRoutes);
        }

        public async Task<CoachRoute> GetById(int id, bool includeTables) {
            return includeTables
                ? await context.CoachRoutes
                    .AsNoTracking()
                    .Include(x => x.Port)
                    .SingleOrDefaultAsync(x => x.Id == id)
                : await context.CoachRoutes
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}