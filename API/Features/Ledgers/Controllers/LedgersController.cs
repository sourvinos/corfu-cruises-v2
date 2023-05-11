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
        public IEnumerable<LedgerVM> Post([FromBody] LedgerCriteria criteria) {
            return repo.Get(criteria.FromDate, criteria.ToDate, criteria.DestinationIds, criteria.PortIds, criteria.ShipIds);
        }
    }

}