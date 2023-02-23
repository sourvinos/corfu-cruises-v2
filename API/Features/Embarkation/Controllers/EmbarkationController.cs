using System.Threading.Tasks;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<EmbarkationFinalGroupVM> Get([FromQuery(Name = "date")] string date, [FromQuery(Name = "destinationId")] int[] destinationIds, [FromQuery(Name = "portId")] int[] portIds, [FromQuery(Name = "shipId")] int?[] shipIds) {
            return await repo.Get(date, destinationIds, portIds, shipIds);
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