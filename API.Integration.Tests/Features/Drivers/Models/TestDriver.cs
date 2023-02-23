using Infrastructure;

namespace Drivers {

    public class TestDriver : ITestEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string LastUpdate { get; set; }
        
    }

}