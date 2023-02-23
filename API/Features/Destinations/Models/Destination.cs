using System.Collections.Generic;
using API.Features.Reservations;
using API.Features.Schedules;
using API.Features.Users;

namespace API.Features.Destinations {

    public class Destination {

        // PK
        public int Id { get; set; }
        // Fields
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public bool IsActive { get; set; }
        public string LastUpdate { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public UserExtended User { get; set; }
        public List<Schedule> Schedules { get; set; }
        public List<Reservation> Reservations { get; set; }

    }

}