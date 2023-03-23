using System;
using System.Collections.Generic;
using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Reservations {

    public class ReservationCalendar : Repository<Reservation>, IReservationCalendar {

        public ReservationCalendar(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> testingEnvironment) : base(context, httpContext, testingEnvironment) { }

        public IEnumerable<ReservationCalendarGroupVM> GetForCalendar(string fromDate, string toDate) {
            return CreateCalendar(GetSchedules(fromDate, toDate), GetReservations(fromDate, toDate));
        }

        /// <summary>
        ///     Gets all schedules for the selected period
        /// </summary>
        /// <param name="fromDate"></param>
        /// <param name="toDate"></param>
        /// <returns>
        ///     A list of ScheduleVM objects
        /// </returns>
        private IList<ScheduleVM> GetSchedules(string fromDate, string toDate) {
            return context.Schedules
                .Include(x => x.Destination)
                .Where(x => x.Date >= DateTime.Parse(fromDate) && x.Date <= DateTime.Parse(toDate))
                .GroupBy(x => new { x.Date, x.DestinationId, x.Destination.Abbreviation, x.Destination.Description })
                .OrderBy(x => x.Key.Date).ThenBy(x => x.Key.DestinationId)
                .Select(x => new ScheduleVM {
                    Date = DateHelpers.DateToISOString(x.Key.Date),
                    Destination = new DestinationVM {
                        Id = x.Key.DestinationId,
                        Abbreviation = x.Key.Abbreviation,
                        Description = x.Key.Description
                    }
                }).ToList();
        }

        /// <summary>
        ///     Gets all reservations for the selected period
        /// </summary>
        /// <param name="fromDate"></param>
        /// <param name="toDate"></param>
        /// <returns>
        ///     A list of ReservationVM objects
        /// </returns>
        private IList<ReservationVM> GetReservations(string fromDate, string toDate) {
            return context.Reservations
                .Where(x => x.Date >= DateTime.Parse(fromDate) && x.Date <= DateTime.Parse(toDate))
                .GroupBy(x => new { x.Date, x.DestinationId, x.Destination.Description, x.Destination.Abbreviation })
                .OrderBy(x => x.Key.Date).ThenBy(x => x.Key.DestinationId)
                .Select(x => new ReservationVM {
                    Date = DateHelpers.DateToISOString(x.Key.Date),
                    DestinationId = x.Key.DestinationId,
                    Pax = x.Sum(x => x.TotalPax)
                }).ToList();
        }

        /// <summary>
        ///     1. Calculates the pax property of the schedules list from the reservations totalPax based on the date and the destination
        ///     2. Groups the schedules list by date and destination
        /// </summary>
        /// <param name="schedules"></param>
        /// <param name="reservations"></param>
        /// <returns>
        ///     A list of ReservationCalendarGroupVM objects
        /// </returns>
        private static IEnumerable<ReservationCalendarGroupVM> CreateCalendar(IList<ScheduleVM> schedules, IList<ReservationVM> reservations) {
            foreach (var schedule in schedules) {
                schedule.Pax = reservations.Where(x => x.Date == schedule.Date && x.DestinationId == schedule.Destination.Id).Select(x => x.Pax).SingleOrDefault();
            }
            return schedules.GroupBy(x => new { x.Date }).Select(x => new ReservationCalendarGroupVM {
                Date = x.Key.Date,
                Destinations = x.GroupBy(v => new { v.Destination.Id, v.Destination.Abbreviation, v.Destination.Description, v.Pax }).Select(x => new DestinationCalendarVM {
                    Id = x.Key.Id,
                    Abbreviation = x.Key.Abbreviation,
                    Description = x.Key.Description,
                    Pax = x.Key.Pax
                }),
                Pax = x.Sum(x => x.Pax)
            });
        }

    }

}