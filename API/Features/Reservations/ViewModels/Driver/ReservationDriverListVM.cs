namespace API.Features.Reservations {

    public class ReservationDriverListVM {

        public string RefNo { get; set; }
        public string Time { get; set; }
        public string TicketNo { get; set; }
        public string PickupPointDescription { get; set; }
        public string ExactPoint { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string CustomerDescription { get; set; }
        public string Fullname { get; set; }
        public string Remarks { get; set; }
        public string DestinationAbbreviation { get; set; }

    }

}