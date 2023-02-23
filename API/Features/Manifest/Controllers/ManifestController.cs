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
        public ManifestFinalVM Get([FromQuery(Name = "date")] string date, [FromQuery(Name = "destinationId")] int destinationId, [FromQuery(Name = "shipId")] int shipId, [FromQuery(Name = "portId")] int[] portIds) {
            return repo.Get(date, destinationId, shipId, portIds);
        }

    }

}