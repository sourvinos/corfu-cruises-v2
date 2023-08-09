using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Manifest {

    public class ManifestRepository : Repository<Reservation>, IManifestRepository {

        private readonly IMapper mapper;

        public ManifestRepository(AppDbContext appDbContext, IMapper mapper, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> settings) : base(appDbContext, httpContext, settings) {
            this.mapper = mapper;
        }

        public ManifestFinalVM Get(string date, int destinationId, int[] portIds, int? shipId) {
            var manifest = new ManifestInitialVM {
                Date = date,
                Destination = context.Destinations
                    .FirstOrDefault(x => x.Id == destinationId),
                Ship = context.Ships
                    .Include(x => x.ShipOwner)
                    .Include(x => x.Registrars.Where(x => x.IsActive))
                    .Include(x => x.ShipCrews.Where(x => x.IsActive))
                    .Include(x => x.ShipCrews.Where(x => x.IsActive)).ThenInclude(x => x.Gender)
                    .Include(x => x.ShipCrews.Where(x => x.IsActive)).ThenInclude(x => x.Nationality)
                    .Include(x => x.ShipCrews.Where(x => x.IsActive)).ThenInclude(x => x.Occupant)
                    .FirstOrDefault(x => x.Id == shipId),
                ShipRoute = null,
                Passengers = context.Passengers
                    .Include(x => x.Nationality)
                    .Include(x => x.Occupant)
                    .Include(x => x.Gender)
                    .Include(x => x.Reservation)
                    .Where(x => x.Reservation.Date.ToString() == date
                        && x.Reservation.DestinationId == destinationId
                        && x.Reservation.ShipId == shipId
                        && portIds.Contains(x.Reservation.PickupPoint.CoachRoute.PortId)
                        && x.IsCheckedIn)
                    .ToList()
            };
            return mapper.Map<ManifestInitialVM, ManifestFinalVM>(manifest);
        }

    }

}