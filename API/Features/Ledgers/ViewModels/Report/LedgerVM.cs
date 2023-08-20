using API.Infrastructure.Classes;
using System.Collections.Generic;

namespace API.Features.Ledger {

    public class LedgerVM {

        public SimpleEntity Customer { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPax { get; set; }
        public int TotalEmbarked { get; set; }
        public int TotalNoShow { get; set; }
        public IEnumerable<LedgerPortVM> Ports { get; set; }
        public List<LedgerReservationVM> Reservations { get; set; }

    }

}