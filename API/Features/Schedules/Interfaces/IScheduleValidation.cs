using System.Collections.Generic;
using API.Infrastructure.Interfaces;

namespace API.Features.Schedules {

    public interface IScheduleValidation : IRepository<Schedule> {

        int IsValidOnNew(List<ScheduleWriteDto> schedules);
        int IsValidOnUpdate(ScheduleWriteDto schedule);

    }

}