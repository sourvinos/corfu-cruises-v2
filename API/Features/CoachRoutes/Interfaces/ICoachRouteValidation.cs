using API.Infrastructure.Interfaces;

namespace API.Features.CoachRoutes {

    public interface ICoachRouteValidation : IRepository<CoachRoute> {

        int IsValid(CoachRouteWriteDto coachRoute);

    }

}