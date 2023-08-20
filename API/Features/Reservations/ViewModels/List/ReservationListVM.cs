using API.Infrastructure.Classes;
using System;

namespace API.Features.Reservations {

    public class ReservationListVM {

        public Guid ReservationId { get; set; }

        public string Date { get; set; }
        public string RefNo { get; set; }
        public string TicketNo { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPax { get; set; }

        public SimpleEntity Customer { get; set; }
        public ReservationListCoachRouteVM CoachRoute { get; set; }
        public ReservationListDestinationVM Destination { get; set; }
        public ReservationListDriverVM Driver { get; set; }
        public ReservationListPickupPointVM PickupPoint { get; set; }
        public ReservationListPortVM Port { get; set; }
        public SimpleEntity Ship { get; set; }

        public int PassengerCount { get; set; }
        public int PassengerDifference { get; set; }

    }

}