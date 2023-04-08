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

        [HttpGet("date/{date}/destinationId/{destinationId}/refNo/{refNo}/ticketNo/{ticketNo}/lastname/{lastname}/firstname/{firstname}")]
        public async Task<ResponseWithBody> GetByCriteriaAsync(string date, int destinationId, string refNo, string ticketNo, string lastname, string firstname) {
            var x = await checkInReadRepo.GetByCriteriaAsync(date, destinationId, refNo, ticketNo, lastname, firstname);
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