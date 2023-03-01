namespace API.Features.PickupPoints {

    public class PickupPointListVM {

        public int Id { get; set; }
        public string Description { get; set; }
        public PickupPointListCoachRouteVM CoachRoute { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public bool IsActive { get; set; }

    }

}