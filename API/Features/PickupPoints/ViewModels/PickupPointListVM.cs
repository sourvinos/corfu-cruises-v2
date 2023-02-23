using API.Infrastructure.Classes;

namespace API.Features.PickupPoints {

    public class PickupPointListVM {

        public int Id { get; set; }
        public string Description { get; set; }
        public SimpleEntity CoachRoute { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public bool IsActive { get; set; }

    }

}