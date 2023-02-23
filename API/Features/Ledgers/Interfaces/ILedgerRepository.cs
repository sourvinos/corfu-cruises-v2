using System.Collections.Generic;

namespace API.Features.Ledger {

    public interface ILedgerRepository {

        IEnumerable<LedgerVM> Get(string fromDate, string toDate, int[] customerIds, int[] destinationIds, int?[] shipIds);

    }

}