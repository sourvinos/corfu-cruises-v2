using API.Features.Schedules;

namespace API.Features.Reservations {

    public interface IReservationValidation {

        bool IsUserOwner(int customerId);
        bool IsKeyUnique(ReservationWriteDto reservation);
        int GetPortIdFromPickupPointId(ReservationWriteDto reservation);
        bool IsOverbooked(string date, int destinationId);
        int IsValid(ReservationWriteDto reservation, IScheduleRepository scheduleRepo);

    }

}