using Infrastructure;

namespace Ports {

    public class TestPort : ITestEntity {

        public int StatusCode { get; set; }
        
        public int Id { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public int StopOrder { get; set; }
        public string LastUpdate { get; set; }

    }

}