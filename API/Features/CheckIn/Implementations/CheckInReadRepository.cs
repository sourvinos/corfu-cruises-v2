using System.Linq;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.CheckIn {

    public class CheckInReadRepository : Repository<Reservation>, ICheckInReadRepository {

        public CheckInReadRepository(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> testingEnvironment) : base(context, httpContext, testingEnvironment) { }

        public async Task<Reservation> GetByCriteriaAsync(string date, int destinationId, string refNo, string ticketNo, string lastname, string firstname) {
            var reservations = await context.Reservations
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
               .Where(x => x.Date.ToString() == date && x.DestinationId == destinationId)
               .ToListAsync();
            if (refNo != "null") {
                return reservations.Where(x => x.RefNo.ToLower() == refNo.ToLower()).FirstOrDefault();
            }
            if (ticketNo != "null") {
                return reservations.Where(x => x.TicketNo.ToLower() == ticketNo.ToLower()).FirstOrDefault();
            }
            if (lastname != "null" && firstname != "null") {
                return reservations.Where(x => x.Passengers.Any(x => x.Lastname == lastname && x.Firstname == firstname)).FirstOrDefault(); ;
            }
            return null;
        }

    }

}