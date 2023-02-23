using API.Infrastructure.Classes;

namespace API.Features.ShipCrews {

    public class ShipCrewListVM {

        public int Id { get; set; }
        public SimpleEntity Ship { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public bool IsActive { get; set; }

    }

}