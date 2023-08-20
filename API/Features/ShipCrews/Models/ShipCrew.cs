using API.Features.Genders;
using API.Features.Nationalities;
using API.Features.Occupants;
using API.Features.Ships;
using API.Features.Users;
using System;

namespace API.Features.ShipCrews {

    public class ShipCrew {

        // PK
        public int Id { get; set; }
        // FKs
        public int GenderId { get; set; }
        public int NationalityId { get; set; }
        public int OccupantId { get; set; }
        public int ShipId { get; set; }
        // Fields
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public DateTime Birthdate { get; set; }
        public bool IsActive { get; set; }
        public string LastUpdate { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public Gender Gender { get; set; }
        public Nationality Nationality { get; set; }
        public Occupant Occupant { get; set; }
        public Ship Ship { get; set; }
        public UserExtended User { get; set; }

    }

}