using System.Collections.Generic;
using API.Features.Reservations;

namespace API.Features.Embarkation {

    public class EmbarkationInitialGroupVM {

        public int TotalPersons { get; set; }
        public int EmbarkedPassengers { get; set; }
        public int PendingPersons { get; set; }

        public List<Reservation> Reservations { get; set; }

    }

}