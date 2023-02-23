using System.Collections.Generic;

namespace API.Features.Reservations {

    public class ReservationCalendarGroupVM {

        public string Date { get; set; }
        public IEnumerable<DestinationCalendarVM> Destinations { get; set; }
        public int Pax { get; set; }

    }

}