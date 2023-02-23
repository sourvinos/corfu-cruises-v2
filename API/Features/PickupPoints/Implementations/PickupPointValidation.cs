using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.PickupPoints {

    public class PickupPointValidation : Repository<PickupPoint>, IPickupPointValidation {

        public PickupPointValidation(AppDbContext appDbContext, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> settings) : base(appDbContext, httpContext, settings) { }

        public int IsValid(PickupPointWriteDto pickupPoint) {
            return true switch {
                var x when x == !IsValidRoute(pickupPoint) => 408,
                _ => 200,
            };
        }

        private bool IsValidRoute(PickupPointWriteDto pickupPoint) {
            return pickupPoint.Id == 0
                ? context.CoachRoutes
                    .AsNoTracking()
                    .SingleOrDefault(x => x.Id == pickupPoint.CoachRouteId && x.IsActive) != null
                : context.CoachRoutes
                    .AsNoTracking()
                    .SingleOrDefault(x => x.Id == pickupPoint.CoachRouteId) != null;
        }

    }

}