using Infrastructure;

namespace Registrars {

    public class TestRegistrar : ITestEntity {

        public int StatusCode { get; set; }

        public int Id { get; set; }
        public int ShipId { get; set; }
        public string Fullname { get; set; }
        public string LastUpdate { get; set; }

    }

}