using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Features.Embarkation {

    [Route("api/[controller]")]
    public class EmbarkationController : ControllerBase {

        #region variables

        private readonly IEmbarkationRepository repo;

        public EmbarkationController(IEmbarkationRepository repo) {
            this.repo = repo;
        }

        #endregion

        [Authorize(Roles = "admin")]
        public async Task<EmbarkationFinalGroupVM> Post([FromBody] EmbarkationCriteria criteria) {
            return await repo.Get(criteria.Date, criteria.DestinationIds, criteria.PortIds, criteria.ShipIds);
        }

        [HttpPatch("embarkPassengers")]
        [Authorize(Roles = "admin")]
        public Response EmbarkPassengers([FromQuery] bool ignoreCurrentStatus, [FromQuery] int[] id) {
            repo.EmbarkPassengers(ignoreCurrentStatus, id);
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

    }

}