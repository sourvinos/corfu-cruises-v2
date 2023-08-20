using API.Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Customers {

    public interface ICustomerRepository : IRepository<Customer> {

        Task<IEnumerable<CustomerListVM>> GetAsync();
        Task<IEnumerable<CustomerActiveVM>> GetActiveAsync();
        Task<Customer> GetByIdAsync(int id);

    }

}