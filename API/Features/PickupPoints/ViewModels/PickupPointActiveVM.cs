using API.Infrastructure.Classes;

namespace API.Features.PickupPoints {

    public class PickupPointActiveVM {

        public int Id { get; set; }
        public string Description { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public SimpleEntity Port { get; set; }

    }

}