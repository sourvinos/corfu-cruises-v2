using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Availability {

    [Route("api/[controller]")]
    public class AvailabilityController : ControllerBase {

        private readonly IAvailabilityDay availabilityDay;

        public AvailabilityController(IAvailabilityDay availabilityDay) {
            this.availabilityDay = availabilityDay;
        }

        [HttpGet("date/{date}/destinationId/{destinationId}")]
        [Authorize(Roles = "user, admin")]
        public IEnumerable<AvailabilityGroupVM> CalculateAvailability(string date, int destinationId) {
            return availabilityDay.CheckToPatchAllPortsWithZeroFreePax(availabilityDay.CalculateOverbookingPerPort(availabilityDay.CalculateFreePaxPerShip(availabilityDay.GetPaxPerPort(availabilityDay.GetForDay(date, destinationId), availabilityDay.GetReservations(date)))));
        }

    }

}