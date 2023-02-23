using System.Collections.Generic;
using API.Features.Destinations;
using API.Features.Reservations;
using API.Features.ShipRoutes;
using API.Features.Ships;

namespace API.Features.Manifest {

    public class ManifestInitialVM {

        public string Date { get; set; }
        public Destination Destination { get; set; }
        public Ship Ship { get; set; }
        public ShipRoute ShipRoute { get; set; }
        public List<Passenger> Passengers { get; set; }

    }

}