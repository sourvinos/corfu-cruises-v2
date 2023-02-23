using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;

namespace API.Features.Embarkation {

    public class EmbarkationRepository : Repository<Reservation>, IEmbarkationRepository {

        private readonly IMapper mapper;
        private readonly TestingEnvironment testingSettings;

        public EmbarkationRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> testingSettings) : base(appDbContext, httpContext, testingSettings) {
            this.mapper = mapper;
            this.testingSettings = testingSettings.Value;
        }

        public async Task<EmbarkationFinalGroupVM> Get(string date, int[] destinationIds, int[] portIds, int?[] shipIds) {
            var reservations = await context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.PickupPoint)
                .Include(x => x.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Where(x => x.Date == Convert.ToDateTime(date) &&
                    destinationIds.Contains(x.DestinationId) &&
                    portIds.Contains(x.PortId) &&
                    shipIds.Contains(x.ShipId)
                )
                .ToListAsync();
            int totalPersons = reservations.Sum(x => x.TotalPersons);
            int embarkedPassengers = reservations.SelectMany(c => c.Passengers).Count(x => x.IsCheckedIn);
            int remainingPersons = totalPersons - embarkedPassengers;
            var mainResult = new EmbarkationInitialGroupVM {
                TotalPersons = totalPersons,
                EmbarkedPassengers = embarkedPassengers,
                PendingPersons = remainingPersons,
                Reservations = reservations.ToList()
            };
            return mapper.Map<EmbarkationInitialGroupVM, EmbarkationFinalGroupVM>(mainResult);
        }

        public void EmbarkPassengers(bool ignoreCurrentStatus, int[] ids) {
            using var transaction = context.Database.BeginTransaction();
            var records = context.Passengers
                .Where(x => ids.Contains(x.Id))
                .ToList();
            records.ForEach(x => x.IsCheckedIn = ignoreCurrentStatus || !x.IsCheckedIn);
            context.SaveChanges();
            DisposeOrCommit(transaction);
        }

        private void DisposeOrCommit(IDbContextTransaction transaction) {
            if (testingSettings.IsTesting) {
                transaction.Dispose();
            } else {
                transaction.Commit();
            }
        }

    }

}
