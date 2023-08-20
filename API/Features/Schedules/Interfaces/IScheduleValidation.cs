using API.Infrastructure.Interfaces;
using System.Collections.Generic;

namespace API.Features.Schedules {

    public interface IScheduleValidation : IRepository<Schedule> {

        int IsValidOnNew(List<ScheduleWriteDto> schedules);
        int IsValidOnUpdate(ScheduleWriteDto schedule);

    }

}