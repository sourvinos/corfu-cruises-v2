using System.Collections.Generic;
using API.Features.PickupPoints;
using API.Infrastructure.Classes;

namespace API.Features.Reservations {

    public class ReservationReadDto {

        public string ReservationId { get; set; }

        public string Date { get; set; }
        public string RefNo { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPax { get; set; }
        public string TicketNo { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public string Remarks { get; set; }
        public string UserId { get; set; }

        public SimpleEntity Customer { get; set; }
        public SimpleEntity Destination { get; set; }
        public PickupPointActiveVM PickupPoint { get; set; }
        public SimpleEntity Driver { get; set; }
        public SimpleEntity Ship { get; set; }

        public List<PassengerReadDto> Passengers { get; set; }

    }

}