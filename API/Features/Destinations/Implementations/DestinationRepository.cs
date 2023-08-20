using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Features.Destinations {

    public class DestinationRepository : Repository<Destination>, IDestinationRepository {

        private readonly IMapper mapper;

        public DestinationRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, httpContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<DestinationListVM>> GetAsync() {
            var destinations = await context.Destinations
                .AsNoTracking()
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Destination>, IEnumerable<DestinationListVM>>(destinations);
        }

        public async Task<IEnumerable<DestinationActiveVM>> GetActiveAsync() {
            var destinations = await context.Destinations
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Destination>, IEnumerable<DestinationActiveVM>>(destinations);
        }

        public async Task<Destination> GetByIdAsync(int id) {
            return await context.Destinations
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}