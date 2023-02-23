using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.ShipOwners {

    public class ShipOwnerRepository : Repository<ShipOwner>, IShipOwnerRepository {

        private readonly IMapper mapper;

        public ShipOwnerRepository(AppDbContext context, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(context, httpContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ShipOwnerListVM>> GetAsync() {
            var shipOwners = await context.ShipOwners
                .AsNoTracking()
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<ShipOwner>, IEnumerable<ShipOwnerListVM>>(shipOwners);
        }

        public async Task<IEnumerable<ShipOwnerActiveVM>> GetActiveAsync() {
            var shipOwners = await context.ShipOwners
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<ShipOwner>, IEnumerable<ShipOwnerActiveVM>>(shipOwners);
        }

        public async Task<ShipOwner> GetByIdAsync(int id) {
            return await context.ShipOwners
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}