using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Linq;

namespace API.Features.Registrars {

    public class RegistrarValidation : Repository<Registrar>, IRegistrarValidation {

        public RegistrarValidation(AppDbContext appDbContext, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> settings) : base(appDbContext, httpContext, settings) { }

        public int IsValid(RegistrarWriteDto registrar) {
            return true switch {
                var x when x == !IsValidShip(registrar) => 454,
                _ => 200,
            };
        }

        private bool IsValidShip(RegistrarWriteDto registrar) {
            return registrar.Id == 0
                ? context.Ships
                    .AsNoTracking()
                    .SingleOrDefault(x => x.Id == registrar.ShipId && x.IsActive) != null
                : context.Ships
                    .AsNoTracking()
                    .SingleOrDefault(x => x.Id == registrar.ShipId) != null;
        }

    }

}