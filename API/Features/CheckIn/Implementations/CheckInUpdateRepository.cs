using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System;

namespace API.Features.CheckIn {

    public class CheckInUpdateRepository : Repository<Reservation>, ICheckInUpdateRepository {

        private readonly IHttpContextAccessor httpContext;
        private readonly TestingEnvironment testingEnvironment;

        public CheckInUpdateRepository(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> testingEnvironment) : base(context, httpContext, testingEnvironment) {
            this.httpContext = httpContext;
            this.testingEnvironment = testingEnvironment.Value;
        }

        public void Update(Guid reservationId, Reservation reservation) {
            using var transaction = context.Database.BeginTransaction();
            if (Identity.IsUserAdmin(httpContext)) {
                UpdateReservation(reservation);
                DeletePassengers(reservationId, reservation.Passengers);
            } else {
                AddPassengers(reservation.Passengers);
                UpdatePassengers(reservation.Passengers);
                DeletePassengers(reservationId, reservation.Passengers);
            }
            context.SaveChanges();
            if (testingEnvironment.IsTesting) {
                transaction.Dispose();
            } else {
                transaction.Commit();
            }
        }

        private void UpdateReservation(Reservation reservation) {
            context.Reservations.Update(reservation);
        }

        private void AddPassengers(List<Passenger> passengers) {
            if (passengers.Any(x => x.Id == 0)) {
                context.Passengers.AddRange(passengers.Where(x => x.Id == 0));
            }
        }

        private void UpdatePassengers(List<Passenger> passengers) {
            context.Passengers.UpdateRange(passengers.Where(x => x.Id != 0));
        }

        private void DeletePassengers(Guid reservationId, List<Passenger> passengers) {
            var existingPassengers = context.Passengers
                .AsNoTracking()
                .Where(x => x.ReservationId == reservationId)
                .ToList();
            var passengersToUpdate = passengers
                .Where(x => x.Id != 0)
                .ToList();
            var passengersToDelete = existingPassengers
                .Except(passengersToUpdate, new PassengerComparerById())
                .ToList();
            context.Passengers.RemoveRange(passengersToDelete);
        }

        private class PassengerComparerById : IEqualityComparer<Passenger> {
            public bool Equals(Passenger x, Passenger y) {
                return x.Id == y.Id;
            }
            public int GetHashCode(Passenger x) {
                return x.Id.GetHashCode();
            }
        }

    }

}