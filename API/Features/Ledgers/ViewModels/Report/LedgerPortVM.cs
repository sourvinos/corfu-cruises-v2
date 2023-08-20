using API.Infrastructure.Classes;
using System.Collections.Generic;

namespace API.Features.Ledger {

    public class LedgerPortVM {

        public SimpleEntity Port { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPax { get; set; }
        public int TotalPassengers { get; set; }
        public int TotalNoShow { get; set; }
        public IEnumerable<LedgerPortGroupVM> HasTransferGroup { get; set; }

    }

}