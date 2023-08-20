using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Features.Customers {

    public class CustomerRepository : Repository<Customer>, ICustomerRepository {

        private readonly IMapper mapper;

        public CustomerRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, httpContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<CustomerListVM>> GetAsync() {
            var customers = await context.Customers
                .AsNoTracking()
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Customer>, IEnumerable<CustomerListVM>>(customers);
        }

        public async Task<IEnumerable<CustomerActiveVM>> GetActiveAsync() {
            var customers = await context.Customers
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Customer>, IEnumerable<CustomerActiveVM>>(customers);
        }

        public async Task<Customer> GetByIdAsync(int id) {
            return await context.Customers
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}