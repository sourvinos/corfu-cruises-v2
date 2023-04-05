namespace API.Features.Availability {

    public class MaxPaxVM {

        public string Date { get; set; }
        public int BatchId { get; set; }
        public int DestinationId { get; set; }
        public int MaxPax { get; set; }
        public int TotalPax { get; set; }
        public int FreePax { get; set; }

    }

}