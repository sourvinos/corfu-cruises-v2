namespace API.Features.Ledger {

    public class LedgerCriteria {

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int[] DestinationIds { get; set; }
        public int[] PortIds { get; set; }
        public int?[] ShipIds { get; set; }

    }

}