namespace API.Features.Ledger {

    public class LedgerPortGroupVM {

        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPax { get; set; }
        public int TotalPassengers { get; set; }
        public int TotalNoShow { get; set; }
        public bool HasTransfer { get; set; }

    }

}