using System.Collections.Generic;

namespace API.Features.Embarkation {

    public class EmbarkationFinalGroupVM {

        public int TotalPax { get; set; }
        public int EmbarkedPassengers { get; set; }
        public int PendingPax { get; set; }

        public IEnumerable<EmbarkationFinalVM> Reservations { get; set; }

    }

}