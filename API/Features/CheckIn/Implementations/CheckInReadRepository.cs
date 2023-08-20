using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace API.Features.CheckIn {

    public class CheckInReadRepository : Repository<Reservation>, ICheckInReadRepository {

        public CheckInReadRepository(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> testingEnvironment) : base(context, httpContext, testingEnvironment) { }

        public async Task<Reservation> GetByRefNoAsync(string refNo) {
            var reservation = context.Reservations
               .AsNoTracking()
               .Include(x => x.Customer)
               .Include(x => x.Destination)
               .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
               .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
               .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
               .Include(x => x.Passengers).ThenInclude(x => x.Gender)
               .Where(x => x.RefNo.ToLower() == refNo.ToLower())
               .FirstOrDefaultAsync();
            return await reservation;
        }

        public async Task<Reservation> GetByDateAsync(string date, int destinationId, string lastname, string firstname) {
            var reservation = context.Reservations
               .AsNoTracking()
               .Include(x => x.Customer)
               .Include(x => x.Destination)
               .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
               .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
               .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
               .Include(x => x.Passengers).ThenInclude(x => x.Gender)
               .Where(x => x.Date == Convert.ToDateTime(date)
                    && x.DestinationId == destinationId
                    && x.Passengers.Any(x => x.Lastname.Trim().ToLower() == lastname.Trim().ToLower())
                    && x.Passengers.Any(x => x.Firstname.Trim().ToLower() == firstname.Trim().ToLower()))
                .FirstOrDefaultAsync();
            return await reservation;
        }

        public async Task<Reservation> GetByIdAsync(string reservationId, bool includeTables) {
            return includeTables
                ? await context.Reservations
                    .AsNoTracking()
                    .Include(x => x.Customer)
                    .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
                    .Include(x => x.Destination)
                    .Include(x => x.Driver)
                    .Include(x => x.Ship)
                    .Include(x => x.User)
                    .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                    .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                    .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                    .Where(x => x.ReservationId.ToString() == reservationId)
                    .SingleOrDefaultAsync()
                : await context.Reservations
                    .AsNoTracking()
                    .Include(x => x.Passengers)
                    .Where(x => x.ReservationId.ToString() == reservationId)
                    .SingleOrDefaultAsync();
        }

    }

}