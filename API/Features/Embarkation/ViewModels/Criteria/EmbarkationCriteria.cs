namespace API.Features.Embarkation {

    public class EmbarkationCriteria {

        public string Date { get; set; }
        public int[] DestinationIds { get; set; }
        public int[] PortIds { get; set; }
        public int?[] ShipIds { get; set; }

    }

}