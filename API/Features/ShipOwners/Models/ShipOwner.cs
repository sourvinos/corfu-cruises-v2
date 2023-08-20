using API.Features.Ships;
using API.Features.Users;
using System.Collections.Generic;

namespace API.Features.ShipOwners {

    public class ShipOwner {

        // PK
        public int Id { get; set; }
        // Fields
        public string Description { get; set; }
        public string Profession { get; set; }
        public string Address { get; set; }
        public string TaxNo { get; set; }
        public string City { get; set; }
        public string Phones { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public string LastUpdate { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public UserExtended User { get; set; }
        public List<Ship> Ships { get; set; }

    }

}