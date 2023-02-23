using Infrastructure;

namespace API.IntegrationTests.ShipOwners {

    public class TestShipOwner : ITestEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string LastUpdate { get; set; }

    }

}