using System.Collections.Generic;
using Infrastructure;

namespace Schedules {

    public class NewTestSchedule : ITestEntity {

        public int StatusCode { get; set; }

        public int Id { get; set; }
        public List<TestScheduleBody> TestScheduleBody { get; set; }
        public string LastUpdate { get; set; }
    }

    public class TestScheduleBody {

        public int Id { get; set; }
        public int DestinationId { get; set; }
        public int PortId { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public int MaxPax { get; set; }
 
    }

}