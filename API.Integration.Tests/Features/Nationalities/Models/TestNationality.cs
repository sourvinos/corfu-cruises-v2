using Infrastructure;

namespace Nationalities {

    public class TestNationality:ITestEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Code { get; set; }
        public string LastUpdate { get; set; }

    }

}