using API.Infrastructure.Interfaces;

namespace API.Features.CoachRoutes {

    public class CoachRouteWriteDto : IBaseEntity {

        public int Id { get; set; }
        public int PortId { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public bool HasTransfer { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}
