using API.Features.Reservations;
using API.Features.Schedules;

namespace API.Features.CheckIn {

    public interface ICheckInReservationValidation {

        int GetPortIdFromPickupPointId(ReservationWriteDto reservation);
        int IsValid(ReservationWriteDto reservation, IScheduleRepository scheduleRepo);

    }

}