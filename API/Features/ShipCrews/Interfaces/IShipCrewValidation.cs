using API.Infrastructure.Interfaces;

namespace API.Features.ShipCrews {

    public interface IShipCrewValidation : IRepository<ShipCrew> {

        int IsValid(ShipCrewWriteDto shipCrew);

    }

}