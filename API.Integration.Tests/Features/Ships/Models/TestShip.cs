using Infrastructure;

namespace Ships {

    public class TestShip : ITestEntity {

        public int StatusCode { get; set; }

        public int Id { get; set; }
        public int ShipOwnerId { get; set; }
        public string Description { get; set; }
        public string LastUpdate { get; set; }

    }

}