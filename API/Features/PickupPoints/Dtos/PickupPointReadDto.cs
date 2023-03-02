using API.Features.CoachRoutes;

namespace API.Features.PickupPoints {

    public class PickupPointReadDto {

        public int Id { get; set; }
        public string Description { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public string Remarks { get; set; }
        public bool IsActive { get; set; }

        public CoachRouteActiveVM CoachRoute { get; set; }

    }

}