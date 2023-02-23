using API.Infrastructure.Classes;

namespace API.Features.Ships {

    public class ShipReadDto {

        public int Id { get; set; }
        public string Description { get; set; }
        public string IMO { get; set; }
        public string Flag { get; set; }
        public string RegistryNo { get; set; }
        public string Manager { get; set; }
        public string ManagerInGreece { get; set; }
        public string Agent { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }
        public SimpleEntity ShipOwner { get; set; }

    }

}