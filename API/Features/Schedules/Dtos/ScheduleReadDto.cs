using API.Infrastructure.Classes;

namespace API.Features.Schedules {

    public class ScheduleReadDto {

        public int Id { get; set; }
        public string Date { get; set; }
        public SimpleEntity Destination { get; set; }
        public SimpleEntity Port { get; set; }
        public int MaxPax { get; set; }
        public string Time { get; set; }
        public bool IsActive { get; set; }

    }

}