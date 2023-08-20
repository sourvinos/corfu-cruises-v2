using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Drivers {

    [Route("api/[controller]")]
    public class DriversController : ControllerBase {

        #region variables

        private readonly IDriverRepository driverRepo;
        private readonly IMapper mapper;

        #endregion

        public DriversController(IDriverRepository driverRepo, IMapper mapper) {
            this.driverRepo = driverRepo;
            this.mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<DriverListVM>> GetAsync() {
            return await driverRepo.GetAsync();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<DriverActiveVM>> GetActiveAsync() {
            return await driverRepo.GetActiveAsync();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ResponseWithBody> GetByIdAsync(int id) {
            var x = await driverRepo.GetByIdAsync(id);
            if (x != null) {
                return new ResponseWithBody {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<Driver, DriverReadDto>(x)
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
        public Response Post([FromBody] DriverWriteDto driver) {
            driverRepo.Create(mapper.Map<DriverWriteDto, Driver>((DriverWriteDto)driverRepo.AttachUserIdToDto(driver)));
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] DriverWriteDto driver) {
            var x = await driverRepo.GetByIdAsync(driver.Id);
            if (x != null) {
                driverRepo.Update(mapper.Map<DriverWriteDto, Driver>((DriverWriteDto)driverRepo.AttachUserIdToDto(driver)));
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
            var driver = await driverRepo.GetByIdAsync(id);
            if (driver != null) {
                driverRepo.Delete(driver);
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