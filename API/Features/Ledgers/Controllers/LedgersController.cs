using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Ledger {

    [Route("api/[controller]")]
    public class LedgersController : ControllerBase {

        #region variables

        private readonly ILedgerRepository repo;

        #endregion

        public LedgersController(ILedgerRepository repo) {
            this.repo = repo;
        }

        [Authorize(Roles = "user, admin")]
        public IEnumerable<LedgerVM> Get([FromQuery(Name = "fromDate")] string fromDate, [FromQuery(Name = "toDate")] string toDate, [FromQuery(Name = "customerId")] int[] customerIds, [FromQuery(Name = "destinationId")] int[] destinationIds, [FromQuery(Name = "shipId")] int?[] shipIds) {
            return repo.Get(fromDate, toDate, customerIds, destinationIds, shipIds);
        }
    }
    
}