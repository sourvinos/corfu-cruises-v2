using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Ports {

    public class PortRepository : Repository<Port>, IPortRepository {

        private readonly IMapper mapper;

        public PortRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, httpContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<PortListVM>> GetAsync() {
            var ports = await context.Ports
                .AsNoTracking()
                .OrderBy(x => x.StopOrder)
                .ToListAsync();
            return mapper.Map<IEnumerable<Port>, IEnumerable<PortListVM>>(ports);
        }

        public async Task<IEnumerable<PortActiveVM>> GetActiveAsync() {
            var ports = await context.Ports
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Port>, IEnumerable<PortActiveVM>>(ports);
        }

        public async Task<Port> GetByIdAsync(int id) {
            return await context.Ports
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}