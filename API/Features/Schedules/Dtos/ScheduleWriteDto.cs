using API.Infrastructure.Interfaces;

namespace API.Features.Schedules {

    public class ScheduleWriteDto : IBaseEntity {

        public int Id { get; set; }
        public int DestinationId { get; set; }
        public int PortId { get; set; }
        public string Date { get; set; }
        public int MaxPax { get; set; }
        public string DepartureTime { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}