namespace API.Features.Ledger {

    public class LedgerCriteriaVM {

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int[] CustomerIds { get; set; }
        public int[] DestinationIds { get; set; }
        public int?[] ShipIds { get; set; }

    }

}
