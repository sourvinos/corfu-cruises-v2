namespace API.Features.Manifest {

    public class ManifestCriteriaVM {

        public string Date { get; set; }
        public int DestinationId { get; set; }
        public int[] PortIds { get; set; }
        public int? ShipId { get; set; }

    }

}