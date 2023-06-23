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

        public IEnumerable<LedgerVM> Get(string fromDate, string toDate, int[] customerIds, int[] destinationIds, int[] portIds, int?[] shipIds) {
            var connectedCustomerId = GetConnectedCustomerIdForConnectedUser();
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
                    && (connectedCustomerId == null
                        ? customerIds.Contains(x.CustomerId)
                        : x.CustomerId == connectedCustomerId)
                    && destinationIds.Contains(x.DestinationId)
                    && portIds.Contains(x.PortId)
                    && (shipIds.Contains(x.ShipId) || x.ShipId == null))
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
                            TotalPax = x.Sum(x => x.TotalPax),
                            TotalPassengers = x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn)),
                            TotalNoShow = x.Sum(x => x.TotalPax) - x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn)),
                        }).OrderBy(x => !x.HasTransfer),
                        Adults = x.Sum(x => x.Adults),
                        Kids = x.Sum(x => x.Kids),
                        Free = x.Sum(x => x.Free),
                        TotalPax = x.Sum(x => x.TotalPax),
                        TotalPassengers = x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn)),
                        TotalNoShow = x.Sum(x => x.TotalPax) - x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn)),
                    }),
                    Adults = x.Sum(x => x.Adults),
                    Kids = x.Sum(x => x.Kids),
                    Free = x.Sum(x => x.Free),
                    TotalPax = x.Sum(x => x.TotalPax),
                    TotalEmbarked = x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn)),
                    TotalNoShow = x.Sum(x => x.TotalPax) - x.Sum(x => x.Passengers.Count(x => x.IsCheckedIn)),
                    Reservations = x.OrderBy(x => x.Date).ThenBy(x => !x.PickupPoint.CoachRoute.HasTransfer).Select(x => new LedgerReservationVM {
                        Date = DateHelpers.DateToISOString(x.Date),
                        RefNo = x.RefNo,
                        ReservationId = x.ReservationId,
                        Destination = new LedgerSimpleEntityVM {
                            Id = x.Destination.Id,
                            Description = x.Destination.Description,
                            Abbreviation = x.Destination.Abbreviation
                        },
                        PickupPoint = new SimpleEntity {
                            Id = x.PickupPoint.Id,
                            Description = x.PickupPoint.Description
                        },
                        Port = new LedgerSimpleEntityVM {
                            Id = x.Port.Id,
                            Description = x.Port.Description,
                            Abbreviation = x.Port.Abbreviation
                        },
                        Ship = new SimpleEntity {
                            Id = x.Ship != null ? x.Ship.Id : 0,
                            Description = x.Ship != null ? x.Ship.Description : "(EMPTY)"
                        },
                        TicketNo = x.TicketNo,
                        Adults = x.Adults,
                        Kids = x.Kids,
                        Free = x.Free,
                        TotalPax = x.TotalPax,
                        EmbarkedPassengers = x.Passengers.Count(x => x.IsCheckedIn),
                        TotalNoShow = x.TotalPax - x.Passengers.Count(x => x.IsCheckedIn),
                        Remarks = x.Remarks,
                        HasTransfer = x.PickupPoint.CoachRoute.HasTransfer,
                    }).ToList()
                });
            return records;
        }

        private int? GetConnectedCustomerIdForConnectedUser() {
            var isUserAdmin = Identity.IsUserAdmin(httpContext);
            if (!isUserAdmin) {
                var simpleUser = Identity.GetConnectedUserId(httpContext);
                var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, simpleUser);
                return (int)connectedUserDetails.CustomerId;
            }
            return null;
        }

    }

}