using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.PickupPoints {

    [Route("api/[controller]")]
    public class PickupPointsController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly IPickupPointRepository pickupPointRepo;
        private readonly IPickupPointValidation pickupPointValidation;

        #endregion

        public PickupPointsController(IMapper mapper, IPickupPointRepository pickupPointRepo, IPickupPointValidation pickupPointValidation) {
            this.mapper = mapper;
            this.pickupPointRepo = pickupPointRepo;
            this.pickupPointValidation = pickupPointValidation;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<PickupPointListVM>> GetAsync() {
            return await pickupPointRepo.GetAsync();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<PickupPointActiveVM>> GetActiveAsync() {
            return await pickupPointRepo.GetActiveAsync();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ResponseWithBody> GetByIdAsync(int id) {
            var x = await pickupPointRepo.GetByIdAsync(id, true);
            if (x != null) {
                return new ResponseWithBody {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<PickupPoint, PickupPointReadDto>(x)
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
        public Response Post([FromBody] PickupPointWriteDto pickupPoint) {
            var x = pickupPointValidation.IsValid(pickupPoint);
            if (x == 200) {
                pickupPointRepo.Create(mapper.Map<PickupPointWriteDto, PickupPoint>((PickupPointWriteDto)pickupPointRepo.AttachUserIdToDto(pickupPoint)));
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
        public async Task<Response> Put([FromBody] PickupPointWriteDto pickupPoint) {
            var x = await pickupPointRepo.GetByIdAsync(pickupPoint.Id, false);
            if (x != null) {
                var z = pickupPointValidation.IsValid(pickupPoint);
                if (z == 200) {
                    pickupPointRepo.Update(mapper.Map<PickupPointWriteDto, PickupPoint>((PickupPointWriteDto)pickupPointRepo.AttachUserIdToDto(pickupPoint)));
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
            var x = await pickupPointRepo.GetByIdAsync(id, false);
            if (x != null) {
                pickupPointRepo.Delete(x);
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