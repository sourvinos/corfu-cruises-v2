using System;
using System.Collections.Generic;
using System.Linq;
using API.Features.Users;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Ledger {

    public class LedgerRepository : Repository<LedgerRepository>, ILedgerRepository {

        private readonly IHttpContextAccessor httpContext;
        private readonly UserManager<UserExtended> userManager;

        public LedgerRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> settings, UserManager<UserExtended> userManager) : base(appDbContext, httpContext, settings) {
            this.httpContext = httpContext;
            this.userManager = userManager;
        }

        public IEnumerable<LedgerVM> Get(string fromDate, string toDate, int[] customerIds, int[] destinationIds, int?[] shipIds) {
            customerIds = GetConnectedCustomerIdForConnectedUser(customerIds);
            var records = context.Reservations
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.PickupPoint).ThenInclude(x => x.CoachRoute)
                .Include(x => x.Port)
                .Include(x => x.Ship)
                .Include(x => x.Passengers)
                .Where(x => x.Date >= Convert.ToDateTime(fromDate)
                    && x.Date <= Convert.ToDateTime(toDate)
                    && customerIds.Contains(x.CustomerId)
                    && destinationIds.Contains(x.DestinationId)
                    && shipIds.Contains(x.ShipId))
                .AsEnumerable()
                .GroupBy(x => new { x.Customer.Id, x.Customer.Description }).OrderBy(x => x.Key.Description)
                .Select(x => new LedgerVM {
                    Customer = new SimpleEntity {
                        Id = x.Key.Id,
                        Description = x.Key.Description
                    },
                    Ports = x.GroupBy(x => new { x.Port.Id, x.Port.Description, x.Port.StopOrder }).OrderBy(x => x.Key.StopOrder).Select(x => new LedgerPortVM {
                        Port = new SimpleEntity {
                            Id = x.Key.Id,
                            Description = x.Key.Description
                        },
                        HasTransferGroup = x.GroupBy(x => x.PickupPoint.CoachRoute.HasTransfer).Select(x => new LedgerPortGroupVM {
                            HasTransfer = x.Key,
                            Adults = x.Sum(x => x.Adults),
                            Kids = x.Sum(x => x.Kids),
                            Free = x.Sum(x => x.Free),
                            TotalPersons = x.Sum(x => x.TotalPersons),
                            TotalPassengers = x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn)),
                            TotalNoShow = x.Sum(x => x.TotalPersons) - x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn)),
                        }).OrderBy(x => !x.HasTransfer),
                        Adults = x.Sum(x => x.Adults),
                        Kids = x.Sum(x => x.Kids),
                        Free = x.Sum(x => x.Free),
                        TotalPersons = x.Sum(x => x.TotalPersons),
                        TotalPassengers = x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn)),
                        TotalNoShow = x.Sum(x => x.TotalPersons) - x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn)),
                    }),
                    Adults = x.Sum(x => x.Adults),
                    Kids = x.Sum(x => x.Kids),
                    Free = x.Sum(x => x.Free),
                    TotalPersons = x.Sum(x => x.TotalPersons),
                    TotalEmbarked = x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn)),
                    TotalNoShow = x.Sum(x => x.TotalPersons) - x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn)),
                    Reservations = x.OrderBy(x => x.Date).ThenBy(x => !x.PickupPoint.CoachRoute.HasTransfer).Select(x => new LedgerReservationVM {
                        Date = DateHelpers.DateToISOString(x.Date),
                        RefNo = x.RefNo,
                        ReservationId = x.ReservationId,
                        Destination = new LedgerSimpleEntityVM {
                            Id = x.Destination.Id,
                            Description = x.Destination.Description,
                            Abbreviation = x.Destination.Abbreviation
                        },
                        Port = new LedgerSimpleEntityVM {
                            Id = x.Port.Id,
                            Description = x.Port.Description,
                            Abbreviation = x.Port.Abbreviation
                        },
                        Ship = new SimpleEntity {
                            Id = x.Ship.Id,
                            Description = x.Ship.Description
                        },
                        TicketNo = x.TicketNo,
                        Adults = x.Adults,
                        Kids = x.Kids,
                        Free = x.Free,
                        TotalPersons = x.TotalPersons,
                        EmbarkedPassengers = x.Passengers.Count(x => x.IsCheckedIn),
                        TotalNoShow = x.TotalPersons - x.Passengers.Count(x => x.IsCheckedIn),
                        Remarks = x.Remarks,
                        HasTransfer = x.PickupPoint.CoachRoute.HasTransfer,
                    }).ToList()
                });
            return records;
        }

        private int[] GetConnectedCustomerIdForConnectedUser(int[] customerIds) {
            var isUserAdmin = Identity.IsUserAdmin(httpContext);
            if (!isUserAdmin) {
                var simpleUser = Identity.GetConnectedUserId(httpContext);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser);
                int[] x = new int[1];
                x[0] = (int)connectedUserDetails.CustomerId;
                return x;
            }
            return customerIds;
        }

    }

}