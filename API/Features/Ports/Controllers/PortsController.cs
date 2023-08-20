using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Ports {

    [Route("api/[controller]")]
    public class PortsController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly IPortRepository portRepo;
        private readonly IPortValidation portValidation;

        #endregion

        public PortsController(IMapper mapper, IPortRepository portRepository, IPortValidation portValidation) {
            this.mapper = mapper;
            this.portRepo = portRepository;
            this.portValidation = portValidation;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<PortListVM>> GetAsync() {
            return await portRepo.GetAsync();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<PortActiveVM>> GetActiveAsync() {
            return await portRepo.GetActiveAsync();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ResponseWithBody> GetByIdAsync(int id) {
            var x = await portRepo.GetByIdAsync(id);
            if (x != null) {
                return new ResponseWithBody {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<Port, PortReadDto>(x)
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
        public Response Post([FromBody] PortWriteDto port) {
            var x = portValidation.IsValid(port);
            if (x == 200) {
                portRepo.Create(mapper.Map<PortWriteDto, Port>((PortWriteDto)portRepo.AttachUserIdToDto(port)));
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                throw new CustomException() {
                    ResponseCode = x
                };
            }
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] PortWriteDto port) {
            var x = await portRepo.GetByIdAsync(port.Id);
            if (x != null) {
                var z = portValidation.IsValid(port);
                if (z == 200) {
                    portRepo.Update(mapper.Map<PortWriteDto, Port>((PortWriteDto)portRepo.AttachUserIdToDto(port)));
                    return new Response {
                        Code = 200,
                        Icon = Icons.Success.ToString(),
                        Message = ApiMessages.OK()
                    };
                } else {
                    throw new CustomException() {
                        ResponseCode = z
                    };
                }
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> Delete([FromRoute] int id) {
            var x = await portRepo.GetByIdAsync(id);
            if (x != null) {
                portRepo.Delete(x);
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