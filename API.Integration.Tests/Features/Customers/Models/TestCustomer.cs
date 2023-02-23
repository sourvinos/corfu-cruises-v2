using Infrastructure;

namespace Customers {

    public class TestCustomer : ITestEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string LastUpdate { get; set; }
        
    }

}