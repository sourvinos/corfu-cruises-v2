namespace API.Features.Reservations {

    public class ReservationAvailabilityVM {

        public string Date { get; set; }
        public int DestinationId { get; set; }
        public string DestinationDescription { get; set; }
        public string DestinationAbbreviation { get; set; }
        public int PortId { get; set; }
        public string PortAbbreviation { get; set; }
        public int PortStopOrder { get; set; }
        public int MaxPax { get; set; }
        public int Pax { get; set; }
        public int AccumulatedPax { get; set; }
        public int FreeSeats { get; set; }

    }

}