﻿using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Extensions;
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
        private readonly ICheckInUpdateRepository checkInUpdateRepo;

        #endregion

        public CheckInController(IMapper mapper, ICheckInReadRepository checkInReadRepo, ICheckInUpdateRepository checkInUpdateRepo) {
            this.mapper = mapper;
            this.checkInReadRepo = checkInReadRepo;
            this.checkInUpdateRepo = checkInUpdateRepo;
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

        [HttpGet("ticketNo/{ticketNo}")]
        public async Task<ResponseWithBody> GetByTicketNoAsync(string ticketNo) {
            var x = await checkInReadRepo.GetByTicketNoAsync(ticketNo);
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
                checkInUpdateRepo.Update(reservation.ReservationId, mapper.Map<ReservationWriteDto, Reservation>(reservation));
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

    }

}