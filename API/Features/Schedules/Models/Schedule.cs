using System;
using API.Features.Destinations;
using API.Features.Ports;
using API.Features.Users;

namespace API.Features.Schedules {

    public class Schedule {

        // PK
        public int Id { get; set; }
        // FKs
        public int DestinationId { get; set; }
        public int PortId { get; set; }
        // Fields
        public DateTime Date { get; set; }
        public int MaxPax { get; set; }
        public string DepartureTime { get; set; }
        public bool IsActive { get; set; }
        public string LastUpdate { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public Destination Destination { get; set; }
        public Port Port { get; set; }
        public UserExtended User { get; set; }

    }

}