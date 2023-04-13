using System;
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

        public async Task<Reservation> GetByCriteriaAsync(string refNo, string ticketNo, string date, int destinationId, string lastname, string firstname) {
            var reservations = context.Reservations
               .AsNoTracking()
               .Include(x => x.Customer)
               .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute).ThenInclude(z => z.Port)
               .Include(x => x.Destination)
               .Include(x => x.Driver)
               .Include(x => x.Ship)
               .Include(x => x.User)
               .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
               .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
               .Include(x => x.Passengers).ThenInclude(x => x.Gender);
            if (refNo != "null") {
                return await reservations.Where(x => x.RefNo.ToLower() == refNo.ToLower()).FirstOrDefaultAsync();
            }
            if (ticketNo != "null") {
                return await reservations.Where(x => x.TicketNo.ToLower() == ticketNo.ToLower()).FirstOrDefaultAsync();
            }
            if (date != null && destinationId != 0 && lastname != "null" && firstname != "null") {
                return await reservations.Where(x => x.Date == Convert.ToDateTime(date) && destinationId == x.DestinationId && x.Passengers.Any(x => x.Lastname == lastname && x.Firstname == firstname)).FirstOrDefaultAsync();
            }
            return null;
        }

    }

}