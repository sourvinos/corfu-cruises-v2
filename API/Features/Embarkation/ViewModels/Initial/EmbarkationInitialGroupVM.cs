using API.Features.Reservations;
using System.Collections.Generic;

namespace API.Features.Embarkation {

    public class EmbarkationInitialGroupVM {

        public int TotalPax { get; set; }
        public int EmbarkedPassengers { get; set; }
        public int PendingPax { get; set; }

        public List<Reservation> Reservations { get; set; }

    }

}