using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace API.Features.Availability {

    [Route("api/[controller]")]
    public class AvailabilityController : ControllerBase {

        private readonly IAvailabilityCalendar availabilityCalendar;

        public AvailabilityController(IAvailabilityCalendar availabilityCalendar) {
            this.availabilityCalendar = availabilityCalendar;
        }

        [HttpGet("fromDate/{fromDate}/toDate/{toDate}")]
        [Authorize(Roles = "user, admin")]
        public IEnumerable<AvailabilityGroupVM> CalculateAvailability(string fromDate, string toDate) {
            return availabilityCalendar.CalculateFreePax(availabilityCalendar.GetPaxPerPort(availabilityCalendar.AddBatchId(availabilityCalendar.GetSchedule(fromDate, toDate)), availabilityCalendar.GetReservations(fromDate, toDate)));
        }

    }

}