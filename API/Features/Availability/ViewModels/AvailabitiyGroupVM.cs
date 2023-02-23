using System.Collections.Generic;

namespace API.Features.Availability {

    public class AvailabilityGroupVM {

        public string Date { get; set; }
        public IEnumerable<DestinationCalendarVM> Destinations { get; set; }

    }

}