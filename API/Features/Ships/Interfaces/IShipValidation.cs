using API.Infrastructure.Interfaces;

namespace API.Features.Ships {

    public interface IShipValidation : IRepository<Ship> {

        int IsValid(ShipWriteDto ship);

    }

}