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

        public IEnumerable<AvailabilityGroupVM> CalculateFreePaxPerShip(IEnumerable<AvailabilityGroupVM> schedules) {
            var maxPaxArray = new List<MaxPaxVM>();
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    var i = 0;
                    foreach (var port in destination.Ports) {
                        try {
                            if (port.MaxPax != maxPaxArray.Last().MaxPax) {
                                maxPaxArray.Add(new MaxPaxVM {
                                    BatchId = ++i,
                                    DestinationId = destination.Id,
                                    MaxPax = port.MaxPax,
                                    TotalPax = port.Pax,
                                    FreePax = port.MaxPax - port.Pax
                                });
                            } else {
                                maxPaxArray.Last().TotalPax += port.Pax;
                                maxPaxArray.Last().FreePax = maxPaxArray.Last().MaxPax - maxPaxArray.Last().TotalPax;
                            }
                        } catch (Exception) {
                            maxPaxArray.Add(new MaxPaxVM {
                                BatchId = ++i,
                                DestinationId = destination.Id,
                                MaxPax = port.MaxPax,
                                TotalPax = port.Pax,
                                FreePax = port.MaxPax - port.Pax
                            });
                        }
                    }
                }
            }
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    foreach (var port in destination.Ports) {
                        port.FreePax = maxPaxArray.Where(x => x.MaxPax == port.MaxPax && x.DestinationId == destination.Id).Select(x => x.FreePax).FirstOrDefault();
                        port.FreePax += maxPaxArray.Where(x => x.BatchId < port.BatchId && x.DestinationId == destination.Id).Select(x => x.FreePax).Sum();
                    }
                }
            }
            return schedules;
        }

        public IEnumerable<AvailabilityGroupVM> CalculateOverbookingPerPort(IEnumerable<AvailabilityGroupVM> schedules) {
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    foreach (var port in destination.Ports.OrderByDescending(x => x.StopOrder)) {
                        if (port.Pax > port.MaxPax) {
                            AddOverbookingToPreviousPorts(destination.Id, port.Pax - port.MaxPax, port.BatchId, schedules);
                        }
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

        private static IEnumerable<AvailabilityGroupVM> AddOverbookingToPreviousPorts(int destinationId, int overbooking, int batchId, IEnumerable<AvailabilityGroupVM> schedules) {
            foreach (var schedule in schedules) {
                foreach (var destination in schedule.Destinations) {
                    if (destination.Id == destinationId) {
                        foreach (var port in destination.Ports) {
                            if (port.BatchId < batchId) {
                                port.FreePax -= overbooking;
                            }
                        }
                    }
                }
            }
            return schedules;
        }

    }

}