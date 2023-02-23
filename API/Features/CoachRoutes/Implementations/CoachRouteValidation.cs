using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.CoachRoutes {

    public class CoachRouteValidation : Repository<CoachRoute>, ICoachRouteValidation {

        public CoachRouteValidation(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> settings) : base(context, httpContext, settings) { }

        public int IsValid(CoachRouteWriteDto coachRoute) {
            return true switch {
                var x when x == !IsValidPort(coachRoute) => 450,
                _ => 200,
            };
        }

        private bool IsValidPort(CoachRouteWriteDto coachRoute) {
            return coachRoute.Id == 0
                ? context.Ports
                    .AsNoTracking()
                    .SingleOrDefault(x => x.Id == coachRoute.PortId && x.IsActive) != null
                : context.Ports
                    .AsNoTracking()
                    .SingleOrDefault(x => x.Id == coachRoute.PortId) != null;
        }

    }

}