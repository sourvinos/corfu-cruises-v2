using API.Features.Reservations;
using API.Features.Schedules;

namespace API.Features.CheckIn {

    public interface ICheckInReservationValidation {

        int IsValid(Reservation reservation, IScheduleRepository scheduleRepo);

    }

}