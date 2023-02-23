using System.Collections.Generic;
using API.Features.Reservations;
using API.Features.Users;

namespace API.Features.Occupants {

    public class Occupant {

        // PK
        public int Id { get; set; }
        // Fields
        public string Description { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public UserExtended User { get; set; }
        public List<Passenger> Passengers { get; set; }

    }

}