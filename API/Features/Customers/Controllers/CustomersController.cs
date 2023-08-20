using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Customers {

    [Route("api/[controller]")]
    public class CustomersController : ControllerBase {

        #region variables

        private readonly ICustomerRepository customerRepo;
        private readonly IMapper mapper;

        #endregion

        public CustomersController(ICustomerRepository customerRepo, IMapper mapper) {
            this.customerRepo = customerRepo;
            this.mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<CustomerListVM>> GetAsync() {
            return await customerRepo.GetAsync();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<CustomerActiveVM>> GetActiveAsync() {
            return await customerRepo.GetActiveAsync();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ResponseWithBody> GetByIdAsync(int id) {
            var x = await customerRepo.GetByIdAsync(id);
            if (x != null) {
                return new ResponseWithBody {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<Customer, CustomerReadDto>(x)
                };
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public Response Post([FromBody] CustomerWriteDto customer) {
            customerRepo.Create(mapper.Map<CustomerWriteDto, Customer>((CustomerWriteDto)customerRepo.AttachUserIdToDto(customer)));
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] CustomerWriteDto customer) {
            var x = await customerRepo.GetByIdAsync(customer.Id);
            if (x != null) {
                customerRepo.Update(mapper.Map<CustomerWriteDto, Customer>((CustomerWriteDto)customerRepo.AttachUserIdToDto(customer)));
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> Delete([FromRoute] int id) {
            var x = await customerRepo.GetByIdAsync(id);
            if (x != null) {
                customerRepo.Delete(x);
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

    }

}