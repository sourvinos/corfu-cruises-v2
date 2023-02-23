namespace API.Features.Reservations {

    public class ScheduleVM {

        public string Date { get; set; }
        public DestinationVM Destination { get; set; }
        public int Pax { get; set; }

    }

}