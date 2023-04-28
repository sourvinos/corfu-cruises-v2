using System.Collections.Generic;

namespace API.Features.Ledger {

    public interface ILedgerRepository {

        IEnumerable<LedgerVM> Get(string fromDate, string toDate, int[] destinationIds, int[] portIds, int?[] shipIds);

    }

}