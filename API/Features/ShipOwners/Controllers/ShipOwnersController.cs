using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.ShipOwners {

    [Route("api/[controller]")]
    public class ShipOwnersController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly IShipOwnerRepository shipOwnerRepo;

        #endregion

        public ShipOwnersController(IMapper mapper, IShipOwnerRepository shipOwnerRepo) {
            this.mapper = mapper;
            this.shipOwnerRepo = shipOwnerRepo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ShipOwnerListVM>> GetAsync() {
            return await shipOwnerRepo.GetAsync();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<ShipOwnerActiveVM>> GetActiveAsync() {
            return await shipOwnerRepo.GetActiveAsync();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ResponseWithBody> GetByIdAsync(int id) {
            var x = await shipOwnerRepo.GetByIdAsync(id);
            if (x != null) {
                return new ResponseWithBody {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<ShipOwner, ShipOwnerReadDto>(x)
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
        public Response Post([FromBody] ShipOwnerWriteDto shipOwner) {
            shipOwnerRepo.Create(mapper.Map<ShipOwnerWriteDto, ShipOwner>((ShipOwnerWriteDto)shipOwnerRepo.AttachUserIdToDto(shipOwner)));
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] ShipOwnerWriteDto shipOwner) {
            var x = await shipOwnerRepo.GetByIdAsync(shipOwner.Id);
            if (x != null) {
                shipOwnerRepo.Update(mapper.Map<ShipOwnerWriteDto, ShipOwner>((ShipOwnerWriteDto)shipOwnerRepo.AttachUserIdToDto(shipOwner)));
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
            var x = await shipOwnerRepo.GetByIdAsync(id);
            if (x != null) {
                shipOwnerRepo.Delete(x);
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