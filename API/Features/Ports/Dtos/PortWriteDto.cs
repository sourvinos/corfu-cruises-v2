using API.Infrastructure.Interfaces;

namespace API.Features.Ports {

    public class PortWriteDto : IBaseEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public int StopOrder { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}