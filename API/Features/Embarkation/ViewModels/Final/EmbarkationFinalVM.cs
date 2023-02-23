using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Embarkation {

    public class EmbarkationFinalVM {

        public string RefNo { get; set; }
        public string TicketNo { get; set; }
        public string Remarks { get; set; }
        public SimpleEntity Customer { get; set; }
        public SimpleEntity Destination { get; set; }
        public SimpleEntity Driver { get; set; }
        public SimpleEntity PickupPoint { get; set; }
        public SimpleEntity Port { get; set; }
        public SimpleEntity Ship { get; set; }
        public int TotalPersons { get; set; }
        public int EmbarkedPassengers { get; set; }
        public SimpleEntity EmbarkationStatus { get; set; }

        public int[] PassengerIds { get; set; }

        public List<EmbarkationFinalPassengerVM> Passengers { get; set; }

    }

}