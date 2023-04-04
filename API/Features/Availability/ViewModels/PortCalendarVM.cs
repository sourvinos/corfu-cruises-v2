namespace API.Features.Availability {

    public class PortCalendarVM {

        public int Id { get; set; }
        public int BatchId { get; set; }
        public string Description { get; set; }
        public int StopOrder { get; set; }
        public string Abbreviation { get; set; }
        public int MaxPax { get; set; }
        public int Pax { get; set; }
        public int FreePax { get; set; }

    }

}