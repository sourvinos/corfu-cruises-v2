using API.Infrastructure.Interfaces;

namespace API.Features.PickupPoints {

    public interface IPickupPointValidation : IRepository<PickupPoint> {

        int IsValid(PickupPointWriteDto pickupPoint);

    }

}