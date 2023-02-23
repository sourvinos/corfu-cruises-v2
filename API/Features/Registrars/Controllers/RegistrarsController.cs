using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Registrars {

    [Route("api/[controller]")]
    public class RegistrarsController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly IRegistrarRepository registrarRepo;
        private readonly IRegistrarValidation registrarValidation;

        #endregion

        public RegistrarsController(IMapper mapper, IRegistrarRepository registrarRepo, IRegistrarValidation registrarValidation) {
            this.mapper = mapper;
            this.registrarRepo = registrarRepo;
            this.registrarValidation = registrarValidation;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<RegistrarListVM>> GetAsync() {
            return await registrarRepo.GetAsync();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<RegistrarActiveVM>> GetActiveAsync() {
            return await registrarRepo.GetActiveAsync();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ResponseWithBody> GetByIdAsync(int id) {
            var x = await registrarRepo.GetByIdAsync(id, true);
            if (x != null) {
                return new ResponseWithBody {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<Registrar, RegistrarReadDto>(x)
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
        public Response Post([FromBody] RegistrarWriteDto registrar) {
            var x = registrarValidation.IsValid(registrar);
            if (x == 200) {
                registrarRepo.Create(mapper.Map<RegistrarWriteDto, Registrar>((RegistrarWriteDto)registrarRepo.AttachUserIdToDto(registrar)));
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
        public async Task<Response> Put([FromBody] RegistrarWriteDto registrar) {
            var x = await registrarRepo.GetByIdAsync(registrar.Id, false);
            if (x != null) {
                var z = registrarValidation.IsValid(registrar);
                if (z == 200) {
                    registrarRepo.Update(mapper.Map<RegistrarWriteDto, Registrar>((RegistrarWriteDto)registrarRepo.AttachUserIdToDto(registrar)));
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
            var x = await registrarRepo.GetByIdAsync(id, false);
            if (x != null) {
                registrarRepo.Delete(x);
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