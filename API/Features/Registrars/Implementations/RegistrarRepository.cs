using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Features.Registrars {

    public class RegistrarRepository : Repository<Registrar>, IRegistrarRepository {

        private readonly IMapper mapper;

        public RegistrarRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, httpContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<RegistrarListVM>> GetAsync() {
            var registrars = await context.Registrars
                .AsNoTracking()
                .Include(x => x.Ship)
                .OrderBy(x => x.Ship.Description).ThenBy(x => !x.IsPrimary).ThenBy(x => x.Fullname)
                .ToListAsync();
            return mapper.Map<IEnumerable<Registrar>, IEnumerable<RegistrarListVM>>(registrars);
        }

        public async Task<IEnumerable<RegistrarActiveVM>> GetActiveAsync() {
            var registrars = await context.Registrars
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Fullname)
                .ToListAsync();
            return mapper.Map<IEnumerable<Registrar>, IEnumerable<RegistrarActiveVM>>(registrars);
        }

        public async Task<Registrar> GetByIdAsync(int id, bool includeTables) {
            return includeTables
                ? await context.Registrars
                    .AsNoTracking()
                    .Include(x => x.Ship)
                    .SingleOrDefaultAsync(x => x.Id == id)
                : await context.Registrars
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}