using API.Infrastructure.Interfaces;

namespace API.Features.ShipOwners {

    public class ShipOwnerWriteDto : IBaseEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Profession { get; set; }
        public string Address { get; set; }
        public string TaxNo { get; set; }
        public string City { get; set; }
        public string Phones { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}