using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Schedules {

    public interface IScheduleRepository : IRepository<Schedule> {

        Task<IEnumerable<ScheduleListVM>> GetAsync();
        Task<Schedule> GetByIdAsync(int id, bool includeTables);
        List<ScheduleWriteDto> AttachUserIdToDtos(List<ScheduleWriteDto> schedules);

    }

}