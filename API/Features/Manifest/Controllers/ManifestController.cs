using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Manifest {

    [Route("api/[controller]")]
    public class ManifestController : ControllerBase {

        #region variables

        private readonly IManifestRepository repo;

        #endregion

        public ManifestController(IManifestRepository repo) {
            this.repo = repo;
        }

        [Authorize(Roles = "admin")]
        public ManifestFinalVM Post([FromBody] ManifestCriteriaVM criteria) {
            return repo.Get(criteria.Date, criteria.DestinationId, criteria.PortIds, criteria.ShipId);
        }

    }

}