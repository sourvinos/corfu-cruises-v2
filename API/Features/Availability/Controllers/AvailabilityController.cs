﻿using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Availability {

    [Route("api/[controller]")]
    public class AvailabilityController : ControllerBase {

        #region variables

        private readonly IAvailabilityCalendar availabilityCalendar;
        private readonly IAvailabilityDay availabilityDay;

        #endregion

        public AvailabilityController(IAvailabilityCalendar availabilityCalendar, IAvailabilityDay availabilityDay) {
            this.availabilityCalendar = availabilityCalendar;
            this.availabilityDay = availabilityDay;
        }

        [HttpGet("date/{date}/destinationId/{destinationId}/portId/{portId}")]
        [Authorize(Roles = "user, admin")]
        public IEnumerable<AvailabilityGroupVM> CalculateAvailability(string date, int destinationId, int portId) {
            // return availabilityDay.DoFinal(availabilityDay.CalculateActualFreePax(availabilityDay.CalculateOverbookingPerPort(availabilityDay.CalculateAccumulatedFreePaxPerPort(availabilityDay.CalculateAccumulatedMaxPaxPerPort(availabilityDay.CalculateAccumulatedPaxPerPort(availabilityDay.GetPaxPerPort(availabilityDay.GetForDay(date, destinationId, portId), availabilityDay.GetReservations(date))))))));
            return availabilityDay.CalculateOverbookingPerPort(availabilityDay.CalculateAccumulatedMaxPaxPerPort(availabilityDay.CalculateAccumulatedPaxPerPort(availabilityDay.GetPaxPerPort(availabilityDay.GetForDay(date, destinationId, portId), availabilityDay.GetReservations(date)))));
        }

        [HttpGet("fromDate/{fromDate}/toDate/{toDate}")]
        [Authorize(Roles = "user, admin")]
        public IEnumerable<AvailabilityGroupVM> GetForCalendar([FromRoute] string fromDate, string toDate) {
            return availabilityDay.CalculateOverbookingPerPort(availabilityCalendar.CalculateAccumulatedMaxPaxPerPort(availabilityCalendar.CalculateAccumulatedPaxPerPort(availabilityCalendar.GetPaxPerPort(availabilityCalendar.GetForCalendar(fromDate, toDate), availabilityCalendar.GetReservations(fromDate, toDate)))));
        }

    }

}