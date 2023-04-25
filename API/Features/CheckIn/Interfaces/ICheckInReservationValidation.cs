using API.Features.Reservations;
using API.Features.Schedules;

namespace API.Features.CheckIn {

    public interface ICheckInReservationValidation {

        int GetPortIdFromPickupPointId(int pickupPointId);
        int IsValid(Reservation reservation, IScheduleRepository scheduleRepo);
        int IsValid(ReservationWriteDto reservation, IScheduleRepository scheduleRepo);

    }

}