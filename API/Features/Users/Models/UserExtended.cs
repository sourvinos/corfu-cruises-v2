using System.Collections.Generic;
using API.Features.CoachRoutes;
using API.Features.Customers;
using API.Features.Destinations;
using API.Features.Drivers;
using API.Features.Genders;
using API.Features.Nationalities;
using API.Features.Occupants;
using API.Features.PickupPoints;
using API.Features.Ports;
using API.Features.Registrars;
using API.Features.Reservations;
using API.Features.Schedules;
using API.Features.ShipCrews;
using API.Features.ShipOwners;
using API.Features.ShipRoutes;
using API.Features.Ships;
using API.Infrastructure.Auth;
using Microsoft.AspNetCore.Identity;

namespace API.Features.Users {

    public class UserExtended : IdentityUser {

        // Fields
        public string Displayname { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public int? CustomerId { get; set; }
        // Navigation
        public Customer Customer { get; set; }
        public List<CoachRoute> CoachRoutes { get; set; }
        public List<Customer> Customers { get; set; }
        public List<Destination> Destinations { get; set; }
        public List<Driver> Drivers { get; set; }
        public List<Gender> Genders { get; set; }
        public List<Nationality> Nationalities { get; set; }
        public List<Occupant> Occupants { get; set; }
        public List<PickupPoint> PickupPoints { get; set; }
        public List<Port> Ports { get; set; }
        public List<Registrar> Registrars { get; set; }
        public List<Reservation> Reservations { get; set; }
        public List<Schedule> Schedules { get; set; }
        public List<Ship> Ships { get; set; }
        public List<ShipCrew> ShipCrews { get; set; }
        public List<ShipOwner> ShipOwners { get; set; }
        public List<ShipRoute> ShipRoutes { get; set; }
        public List<Token> Tokens { get; set; }

    }

}