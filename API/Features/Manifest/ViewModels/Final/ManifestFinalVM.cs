using API.Infrastructure.Classes;
using System.Collections.Generic;

namespace API.Features.Manifest {

    public class ManifestFinalVM {

        public string Date { get; set; }
        public SimpleEntity Destination { get; set; }
        public ManifestFinalShipVM Ship { get; set; }
        public ManifestFinalShipRouteVM ShipRoute { get; set; }
        public List<ManifestFinalPassengerVM> Passengers { get; set; }

    }

}