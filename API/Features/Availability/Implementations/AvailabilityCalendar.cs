using System;
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

        public IEnumerable<ReservationVM> GetReservations(string fromDate, string toDate) {
            var reservations = context.Reservations
                .AsNoTracking()
                .Where(x => x.Date >= DateTime.Parse(fromDate) && x.Date <= DateTime.Parse(toDate))
                .OrderBy(x => x.Date).ThenBy(x => x.DestinationId).ThenBy(x => x.PortId)
                .Select(x => new ReservationVM {
                    Date = DateHelpers.DateToISOString(x.Date),
                    DestinationId = x.DestinationId,
                    PortId = x.PortId,
                    TotalPax = x.TotalPax
                }).ToList();
            return reservations;
        }

        public IEnumerable<AvailabilityGroupVM> GetSchedule(string fromDate, string toDate) {
            var schedules = context.Schedules
                .AsNoTracking()
                .Where(x => x.Date >= DateTime.Parse(fromDate) && x.Date <= DateTime.Parse(toDate))
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
                            StopOrder = x.Key.StopOrder,
                            MaxPax = x.Key.MaxPax,
                        }).ToList()
                    })
                }).ToList();
            return schedules;
        }

        public IEnumerable<AvailabilityGroupVM> GetPaxPerPort(IEnumerable<AvailabilityGroupVM> schedules, IEnumerable<ReservationVM> reservations) {
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    foreach (var port in destination.Ports) {
                        port.Pax = reservations.Where(x => x.Date == schedule.Date && x.DestinationId == destination.Id && x.PortId == port.Id).Sum(x => x.TotalPax);
                    }
                }
            }
            return schedules.ToList();
        }

        public IEnumerable<AvailabilityGroupVM> AddBatchId(IEnumerable<AvailabilityGroupVM> schedules) {
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    var x = 1;
                    var i = destination.Ports.Select(x => x.MaxPax).FirstOrDefault();
                    foreach (var port in destination.Ports) {
                        if (i == port.MaxPax) {
                            port.BatchId = x;
                        } else {
                            port.BatchId = x += 1;
                            i = port.MaxPax;
                        }
                    }
                }
            }
            return schedules.ToList();
        }

        public IEnumerable<AvailabilityGroupVM> CalculateFreePax(IEnumerable<AvailabilityGroupVM> schedules) {
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    if (destination.Ports.Count() == 1) {
                        DoOnePortCalculations(destination);
                    }
                    if (destination.Ports.Count() == 2) {
                        DoTwoPortCalculations(destination);
                    }
                }
            }
            return schedules;
        }

        private static DestinationCalendarVM DoOnePortCalculations(DestinationCalendarVM destination) {
            destination.Ports.First().FreePax = destination.Ports.First().MaxPax - destination.Ports.First().Pax;
            return destination;
        }

        private static DestinationCalendarVM DoTwoPortCalculations(DestinationCalendarVM destination) {
            return destination.Ports.LastOrDefault().BatchId == 1 
                ? DoTwoPortsOneShipCalculations(destination) 
                : DoTwoPortsMultipleShipsCalculations(destination);
        }

        private static DestinationCalendarVM DoTwoPortsOneShipCalculations(DestinationCalendarVM destination) {
            // Two ports, one ship, no overbooking
            if (destination.Ports.FirstOrDefault().Pax + destination.Ports.LastOrDefault().Pax <= destination.Ports.LastOrDefault().MaxPax) {
                destination = DoTwoPortsOneShipNoOverbookingCalculations(destination);
            }
            // Two ports, one ship, with overbooking
            if (destination.Ports.FirstOrDefault().Pax + destination.Ports.LastOrDefault().Pax > destination.Ports.LastOrDefault().MaxPax) {
                destination = DoTwoPortsOneShipWithOverbookingCalculations(destination);
            }
            return destination;
        }

        private static DestinationCalendarVM DoTwoPortsMultipleShipsCalculations(DestinationCalendarVM destination) {
            //  Two ports, multiple ships, no second port overbooking
            if (destination.Ports.LastOrDefault().Pax <= destination.Ports.LastOrDefault().MaxPax) {
                destination = DoTwoPortsMultipleShipsWithNoOverbookingSecondPort(destination);
            }
            // Two ports, multiple ships, second port overbooking
            if (destination.Ports.LastOrDefault().Pax > destination.Ports.LastOrDefault().MaxPax) {
                destination = DoTwoPortsMultipleShipsWithOverbookingSecondPort(destination);
            }
            return destination;
        }

        private static DestinationCalendarVM DoTwoPortsOneShipNoOverbookingCalculations(DestinationCalendarVM destination) {
            // Two ports, one ship, no overbooking
            var firstPortFreePax = destination.Ports.FirstOrDefault().MaxPax - destination.Ports.FirstOrDefault().Pax - destination.Ports.LastOrDefault().Pax;
            var secondPortFreePax = destination.Ports.FirstOrDefault().MaxPax - destination.Ports.FirstOrDefault().Pax - destination.Ports.LastOrDefault().Pax;
            destination.Ports.FirstOrDefault().FreePax = firstPortFreePax;
            destination.Ports.LastOrDefault().FreePax = secondPortFreePax;
            return destination;
        }

        private static DestinationCalendarVM DoTwoPortsOneShipWithOverbookingCalculations(DestinationCalendarVM destination) {
            // Two ports, one ship, with overbooking
            var firstPortFreePax = destination.Ports.FirstOrDefault().MaxPax - destination.Ports.FirstOrDefault().Pax - destination.Ports.LastOrDefault().Pax;
            var secondPortFreePax = destination.Ports.FirstOrDefault().MaxPax - destination.Ports.FirstOrDefault().Pax - destination.Ports.LastOrDefault().Pax;
            destination.Ports.FirstOrDefault().FreePax = firstPortFreePax;
            destination.Ports.LastOrDefault().FreePax = secondPortFreePax;
            return destination;
        }

        private static DestinationCalendarVM DoTwoPortsMultipleShipsWithNoOverbookingSecondPort(DestinationCalendarVM destination) {
            //  Two ports, multiple ships, no second port overbooking
            var firstPortFreePax = destination.Ports.FirstOrDefault().MaxPax - destination.Ports.FirstOrDefault().Pax;
            var secondPortFreePax = firstPortFreePax + destination.Ports.LastOrDefault().MaxPax - destination.Ports.LastOrDefault().Pax;
            destination.Ports.FirstOrDefault().FreePax = firstPortFreePax;
            destination.Ports.LastOrDefault().FreePax = secondPortFreePax;
            return destination;
        }

        private static DestinationCalendarVM DoTwoPortsMultipleShipsWithOverbookingSecondPort(DestinationCalendarVM destination) {
            //  Two ports, multiple ships, second port overbooking
            var firstPortFreePax = destination.Ports.FirstOrDefault().MaxPax - destination.Ports.FirstOrDefault().Pax;
            var secondPortOverbooking = destination.Ports.LastOrDefault().Pax - destination.Ports.LastOrDefault().MaxPax;
            destination.Ports.FirstOrDefault().FreePax = firstPortFreePax - secondPortOverbooking;
            destination.Ports.LastOrDefault().FreePax = firstPortFreePax - secondPortOverbooking;
            return destination;
        }

    }

}