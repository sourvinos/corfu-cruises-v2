using System.Collections.Generic;
using System.Linq;
using API.Features.Schedules;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Availability {

    public class AvailabilityCalendar : Repository<Schedule>, IAvailabilityCalendar {

        public AvailabilityCalendar(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> settings) : base(context, httpContext, settings) { }

        /// <summary>
        ///     Step 1/5
        ///     Creates the calendar (based on the schedules for the selected year) which will contain (after all the processing) the free seats per day, destination and port
        /// </summary>
        /// <param name="year"></param>
        /// <returns>
        ///     A list of AvailabilityCalendarGroupVM, one object for each day
        /// </returns>
        public IEnumerable<AvailabilityGroupVM> GetForCalendar(int year) {
            return context.Schedules
                .AsNoTracking()
                .Where(x => x.Date.Year == year)
                .GroupBy(x => x.Date)
                .Select(x => new AvailabilityGroupVM {
                    Date = DateHelpers.DateToISOString(x.Key.Date),
                    Destinations = x.GroupBy(x => new { x.Date, x.Destination.Id, x.Destination.Description, x.Destination.Abbreviation }).Select(x => new DestinationCalendarVM {
                        Id = x.Key.Id,
                        Description = x.Key.Description,
                        Abbreviation = x.Key.Abbreviation,
                        Ports = x.GroupBy(x => new { x.PortId, x.Port.Description, x.Port.Abbreviation, x.MaxPax, x.Port.StopOrder }).OrderBy(x => x.Key.StopOrder).Select(x => new PortCalendarVM {
                            Id = x.Key.PortId,
                            Description = x.Key.Description,
                            Abbreviation = x.Key.Abbreviation,
                            MaxPax = x.Key.MaxPax,
                        }).ToList()
                    })
                }).ToList();
        }

        /// <summary>
        ///     Step 2/5
        ///     Calculates the total passengers per port
        /// </summary>
        /// <param name="schedules"></param>
        /// <param name="reservations"></param>
        /// <returns>
        ///     The updated AvailabilityCalendarGroupVM object, one for each day
        /// </returns>
        public IEnumerable<AvailabilityGroupVM> GetPaxPerPort(IEnumerable<AvailabilityGroupVM> schedules, IEnumerable<ReservationVM> reservations) {
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    foreach (var port in destination.Ports) {
                        port.Pax = reservations.Where(x => x.Date == schedule.Date && x.DestinationId == destination.Id && x.PortId == port.Id).Sum(x => x.TotalPersons);
                    }
                }
            }
            return schedules.ToList();
        }

        /// <summary>
        ///     Step 3/5
        ///     Calculates the total passengers per port, including the passengers from the previous port (based on the stopOrder property of the port)
        /// </summary>
        /// <param name="schedules"></param>
        /// <returns>
        ///     The updated AvailabilityCalendarGroupVM object, one for each day
        /// </returns>
        public IEnumerable<AvailabilityGroupVM> CalculateAccumulatedPaxPerPort(IEnumerable<AvailabilityGroupVM> schedules) {
            var accumulatedPax = 0;
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    foreach (var port in destination.Ports) {
                        accumulatedPax += port.Pax;
                        port.AccumulatedPax = accumulatedPax;
                    }
                    accumulatedPax = 0;
                }
            }
            return schedules.ToList();
        }

        /// <summary>
        ///     Step 4/5
        ///     Calculates the free seats per port, including the free seats from the previous port (according to the stopOrder property of the port)
        /// </summary>
        /// <param name="schedules"></param>
        /// <returns></returns>
        public IEnumerable<AvailabilityGroupVM> CalculateAccumulatedMaxPaxPerPort(IEnumerable<AvailabilityGroupVM> schedules) {
            var accumulatedMaxPax = 0;
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    foreach (var port in destination.Ports) {
                        accumulatedMaxPax += AreMultipleShipsUsed(destination.Ports, port);
                        port.AccumulatedMaxPax = accumulatedMaxPax;
                    }
                    accumulatedMaxPax = 0;
                }
            }
            return schedules.ToList();
        }

        /// <summary>
        ///     Step 5/5
        ///     Calculates the free seats per port (maximum pax (taken from the schedule) minus total persons (taken from the reservations))
        /// </summary>
        /// <param name="schedules"></param>
        /// <returns>
        ///     The updated AvailabilityCalendarGroupVM object, one for each day
        /// </returns>
        public IEnumerable<AvailabilityGroupVM> CalculateAccumulatedFreePaxPerPort(IEnumerable<AvailabilityGroupVM> schedules) {
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    foreach (var port in destination.Ports) {
                        port.AccumulatedFreePax = port.AccumulatedMaxPax - port.AccumulatedPax;
                    }
                }
            }
            return schedules.ToList();
        }

        /// <summary>
        ///     Gets the reservations for the selected year, without any processing
        /// </summary>
        /// <param name="year"></param>
        /// <returns>
        ///     A list of ReservationVM objects, one per reservation
        /// </returns>
        public IEnumerable<ReservationVM> GetReservations(int year) {
            var reservations = context.Reservations
                .AsNoTracking()
                .Where(x => x.Date.Year == year)
                .OrderBy(x => x.Date).ThenBy(x => x.DestinationId).ThenBy(x => x.PortId)
                .Select(x => new ReservationVM {
                    Date = DateHelpers.DateToISOString(x.Date),
                    DestinationId = x.DestinationId,
                    PortId = x.PortId,
                    TotalPersons = x.TotalPersons
                }).ToList();
            return reservations;
        }

        /// <summary>
        ///     Decides whether to accumulate the max number of passengers or not.
        ///     If the current port has the same max persons as the previous, we don't add the current max persons to the accumulated max persons.
        ///     Practically this means:
        ///         a) If they are equal, the boat departing from the previous port, will also be used to carry the passengers from the current port.
        ///         b) If they are different, there is another boat at the current port and they will be both used.
        /// </summary>
        /// <param name="ports"></param>
        /// <param name="currentPort"></param>
        /// <returns>
        ///     Zero, for the above a) case
        ///     The max passengers, for the above b) case 
        /// </returns>
        private static int AreMultipleShipsUsed(IEnumerable<PortCalendarVM> ports, PortCalendarVM currentPort) {
            var previousPort = ports.TakeWhile(x => x.Abbreviation != currentPort.Abbreviation).Skip(-1).FirstOrDefault();
            return previousPort == null || currentPort.MaxPax != previousPort.MaxPax
                ? currentPort.MaxPax : 0;
        }

    }

}