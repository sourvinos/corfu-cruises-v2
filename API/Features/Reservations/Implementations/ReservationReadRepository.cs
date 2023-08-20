using API.Features.Drivers;
using API.Features.Users;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace API.Features.Reservations {

    public class ReservationReadRepository : Repository<Reservation>, IReservationReadRepository {

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        private readonly UserManager<UserExtended> userManager;

        public ReservationReadRepository(AppDbContext context, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> testingEnvironment, UserManager<UserExtended> userManager) : base(context, httpContext, testingEnvironment) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.userManager = userManager;
        }

        public async Task<IEnumerable<ReservationListVM>> GetByDateAsync(string date) {
            IEnumerable<Reservation> reservations;
            if (Identity.IsUserAdmin(httpContext)) {
                reservations = await GetReservationsFromAllUsersByDateAsync(date);
            } else {
                var simpleUser = Identity.GetConnectedUserId(httpContext);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser);
                reservations = await GetReservationsForLinkedCustomerAsync(date, (int)connectedUserDetails.CustomerId);
            }
            return mapper.Map<IEnumerable<Reservation>, IEnumerable<ReservationListVM>>(reservations);
        }

        public async Task<IEnumerable<ReservationListVM>> GetByRefNoAsync(string refNo) {
            IEnumerable<Reservation> reservations;
            if (Identity.IsUserAdmin(httpContext)) {
                reservations = await GetReservationsFromAllUsersByRefNoAsync(refNo);
            } else {
                var userId = Identity.GetConnectedUserId(httpContext);
                var userDetails = Identity.GetConnectedUserDetails(userManager, userId);
                reservations = await GetReservationsFromLinkedCustomerbyRefNoAsync(refNo, (int)userDetails.CustomerId);
            }
            return mapper.Map<IEnumerable<Reservation>, IEnumerable<ReservationListVM>>(reservations);
        }

        public async Task<ReservationDriverGroupVM> GetByDateAndDriverAsync(string date, int driverId) {
            var driver = await GetDriverAsync(driverId);
            var reservations = await GetReservationsByDateAndDriverAsync(date, driverId);
            return new ReservationDriverGroupVM {
                Date = date,
                DriverId = driver != null ? driverId : 0,
                DriverDescription = driver != null ? driver.Description : "(EMPTY)",
                Phones = driver != null ? driver.Phones : "(EMPTY)",
                Reservations = mapper.Map<IEnumerable<Reservation>, IEnumerable<ReservationDriverListVM>>(reservations)
            };
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

        private async Task<IEnumerable<Reservation>> GetReservationsFromAllUsersByDateAsync(string date) {
            return await context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute)
                .Include(x => x.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(date))
                .ToListAsync();
        }

        private async Task<IEnumerable<Reservation>> GetReservationsForLinkedCustomerAsync(string date, int customerId) {
            return await context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute)
                .Include(x => x.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(date) && x.CustomerId == customerId)
                .ToListAsync();
        }

        private async Task<IEnumerable<Reservation>> GetReservationsFromAllUsersByRefNoAsync(string refNo) {
            return await context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute)
                .Include(z => z.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.RefNo == refNo)
                .ToListAsync();
        }

        private async Task<IEnumerable<Reservation>> GetReservationsFromLinkedCustomerbyRefNoAsync(string refNo, int customerId) {
            return await context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint).ThenInclude(y => y.CoachRoute)
                .Include(z => z.Port)
                .Include(x => x.Ship)
                .Where(x => x.RefNo == refNo && x.CustomerId == customerId)
                .ToListAsync();
        }

        private async Task<IEnumerable<Reservation>> GetReservationsByDateAndDriverAsync(string date, int driverId) {
            return await context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DriverId == (driverId != 0 ? driverId : null))
                .OrderBy(x => x.PickupPoint.Time).ThenBy(x => x.PickupPoint.Description)
                .ToListAsync();
        }

        private async Task<Driver> GetDriverAsync(int driverId) {
            return await context.Drivers
                .AsNoTracking()
                .Where(x => x.Id == driverId)
                .SingleOrDefaultAsync();
        }

    }

}