using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Features.Nationalities {

    [Route("api/[controller]")]
    public class NationalitiesController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly INationalityRepository nationalityRepo;

        #endregion

        public NationalitiesController(IMapper mapper, INationalityRepository nationalityRepo) {
            this.mapper = mapper;
            this.nationalityRepo = nationalityRepo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<NationalityListVM>> GetAsync() {
            return await nationalityRepo.GetAsync();
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<NationalityActiveVM>> GetActiveAsync() {
            return await nationalityRepo.GetActiveAsync();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ResponseWithBody> GetByIdAsync(int id) {
            var x = await nationalityRepo.GetByIdAsync(id);
            if (x != null) {
                return new ResponseWithBody {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<Nationality, NationalityReadDto>(x)
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
        public Response Post([FromBody] NationalityWriteDto nationality) {
            nationalityRepo.Create(mapper.Map<NationalityWriteDto, Nationality>((NationalityWriteDto)nationalityRepo.AttachUserIdToDto(nationality)));
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] NationalityWriteDto nationality) {
            var x = await nationalityRepo.GetByIdAsync(nationality.Id);
            if (x != null) {
                nationalityRepo.Update(mapper.Map<NationalityWriteDto, Nationality>((NationalityWriteDto)nationalityRepo.AttachUserIdToDto(nationality)));
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
            var x = await nationalityRepo.GetByIdAsync(id);
            if (x != null) {
                nationalityRepo.Delete(x);
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