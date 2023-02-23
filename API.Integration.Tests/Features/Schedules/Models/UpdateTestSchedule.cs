using Infrastructure;

namespace Schedules {

    public class UpdateTestSchedule : ITestEntity {

        public int StatusCode { get; set; }

        public int Id { get; set; }
        public int DestinationId { get; set; }
        public int PortId { get; set; }
        public string Date { get; set; }
        public string DepartureTime { get; set; }
        public int MaxPax { get; set; }
        public string LastUpdate { get; set; }

    }

}