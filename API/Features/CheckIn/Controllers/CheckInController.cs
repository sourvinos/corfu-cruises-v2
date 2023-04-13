using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.CheckIn {

    [Route("api/[controller]")]
    public class CheckInController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly ICheckInReadRepository checkInReadRepo;

        #endregion

        public CheckInController(IMapper mapper, ICheckInReadRepository checkInReadRepo) {
            this.mapper = mapper;
            this.checkInReadRepo = checkInReadRepo;
        }

        [HttpGet("refNo/{refNo}/ticketNo/{ticketNo}/date/{date}/destinationId/{destinationId}/lastname/{lastname}/firstname/{firstname}")]
        public async Task<ResponseWithBody> GetByCriteriaAsync(string refNo, string ticketNo, string date, int destinationId, string lastname, string firstname) {
            var x = await checkInReadRepo.GetByCriteriaAsync(refNo, ticketNo, date, destinationId, lastname, firstname);
            if (x != null) {
                return new ResponseWithBody {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<Reservation, ReservationReadDto>(x)
                };
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

    }

}