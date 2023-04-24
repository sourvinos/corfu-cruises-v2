using System.Threading.Tasks;
using API.Features.Reservations;
using API.Features.Schedules;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.CheckIn {

    [Route("api/[controller]")]
    public class CheckInController : ControllerBase {

        #region variables

        private readonly ICheckInEmailSender checkInEmailSender;
        private readonly ICheckInReadRepository checkInReadRepo;
        private readonly ICheckInReservationValidation checkInReservationValidation;
        private readonly ICheckInUpdateRepository checkInUpdateRepo;
        private readonly IMapper mapper;
        private readonly IScheduleRepository scheduleRepo;

        #endregion

        public CheckInController(ICheckInEmailSender checkInEmailSender, IMapper mapper, ICheckInReadRepository checkInReadRepo, ICheckInReservationValidation checkInReservationValidation, ICheckInUpdateRepository checkInUpdateRepo, IScheduleRepository scheduleRepo) {
            this.checkInEmailSender = checkInEmailSender;
            this.checkInReadRepo = checkInReadRepo;
            this.checkInReservationValidation = checkInReservationValidation;
            this.checkInUpdateRepo = checkInUpdateRepo;
            this.mapper = mapper;
            this.scheduleRepo = scheduleRepo;
        }

        [HttpGet("refNo/{refNo}")]
        public async Task<ResponseWithBody> GetByRefNoAsync(string refNo) {
            var x = await checkInReadRepo.GetByRefNoAsync(refNo);
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

        [HttpGet("date/{date}/destinationId/{destinationId}/lastname/{lastname}/firstname/{firstname}")]
        public async Task<ResponseWithBody> GetByDateAsync(string date, int destinationId, string lastname, string firstname) {
            var x = await checkInReadRepo.GetByDateAsync(date, destinationId, lastname, firstname);
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

        [HttpPut]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] ReservationWriteDto reservation) {
            var x = await checkInReadRepo.GetByIdAsync(reservation.ReservationId.ToString(), false);
            reservation.UserId = x.UserId;
            if (x != null) {
                AttachPortIdToDto(reservation);
                UpdateDriverIdWithNull(reservation);
                UpdateShipIdWithNull(reservation);
                var z = mapper.Map<ReservationWriteDto, Reservation>(reservation);
                checkInUpdateRepo.Update(reservation.ReservationId, z);
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = reservation.RefNo
                };
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpPost("[action]")]
        public SendEmailResponse SendCheckInReservation([FromBody] CheckInReservationVM reservation) {
            return checkInEmailSender.SendEmail(reservation);
        }

        private ReservationWriteDto AttachPortIdToDto(ReservationWriteDto reservation) {
            reservation.PortId = checkInReservationValidation.GetPortIdFromPickupPointId(reservation);
            return reservation;
        }

        private static ReservationWriteDto UpdateDriverIdWithNull(ReservationWriteDto reservation) {
            if (reservation.DriverId == 0) reservation.DriverId = null;
            return reservation;
        }

        private static ReservationWriteDto UpdateShipIdWithNull(ReservationWriteDto reservation) {
            if (reservation.ShipId == 0) reservation.ShipId = null;
            return reservation;
        }

    }

}