using API.Infrastructure.Interfaces;

namespace API.Features.Destinations {

    public class DestinationWriteDto : IBaseEntity {

        public int Id { get; set; }
        public string Abbreviation { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }
        
    }

}