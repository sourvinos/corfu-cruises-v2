using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Embarkation {

    public class EmbarkationMappingProfile : Profile {

        public EmbarkationMappingProfile() {
            CreateMap<EmbarkationInitialGroupVM, EmbarkationFinalGroupVM>()
                .ForMember(x => x.TotalPax, x => x.MapFrom(x => x.TotalPax))
                .ForMember(x => x.EmbarkedPassengers, x => x.MapFrom(x => x.EmbarkedPassengers))
                .ForMember(x => x.PendingPax, x => x.MapFrom(x => x.PendingPax))
                .ForMember(x => x.Reservations, x => x.MapFrom(x => x.Reservations.Select(reservation => new EmbarkationFinalVM {
                    RefNo = reservation.RefNo,
                    TicketNo = reservation.TicketNo,
                    Remarks = reservation.Remarks,
                    Customer = new SimpleEntity { Id = reservation.Customer.Id, Description = reservation.Customer.Description },
                    Destination = new EmbarkationFinalDestinationListVM { Id = reservation.Destination.Id, Abbreviation = reservation.Destination.Abbreviation, Description = reservation.Destination.Description },
                    Driver = new SimpleEntity { Id = reservation.Driver != null ? reservation.Driver.Id : 0, Description = reservation.Driver != null ? reservation.Driver.Description : "(EMPTY)" },
                    PickupPoint = new SimpleEntity { Id = reservation.PickupPoint.Id, Description = reservation.PickupPoint.Description },
                    Port = new EmbarkationFinalPortListVM { Id = reservation.Port.Id, Abbreviation = reservation.Port.Abbreviation, Description = reservation.Port.Description },
                    Ship = new SimpleEntity { Id = reservation.Ship != null ? reservation.Ship.Id : 0, Description = reservation.Ship != null ? reservation.Ship.Description : "(EMPTY)" },
                    TotalPax = reservation.TotalPax,
                    EmbarkedPassengers = reservation.Passengers.Count(x => x.IsCheckedIn),
                    EmbarkationStatus = DetermineEmbarkationStatus(reservation),
                    PassengerIds = reservation.Passengers.Select(x => x.Id).ToArray(),
                    Passengers = reservation.Passengers.Select(passenger => new EmbarkationFinalPassengerVM {
                        Id = passenger.Id,
                        Lastname = passenger.Lastname,
                        Firstname = passenger.Firstname,
                        NationalityCode = passenger.Nationality.Code,
                        NationalityDescription = passenger.Nationality.Description,
                        IsCheckedIn = passenger.IsCheckedIn
                    }).ToList(),
                })));
        }

        private static SimpleEntity DetermineEmbarkationStatus(Reservation reservation) {
            var passengers = reservation.Passengers.Count;
            var embarkedPassengers = reservation.Passengers.Count(x => x.IsCheckedIn);
            if (passengers == 0 || embarkedPassengers == 0) {
                return EmbarkationStatus(2, "None");
            } else {
                if (passengers == embarkedPassengers) {
                    return EmbarkationStatus(1, "All");
                } else {
                    return EmbarkationStatus(3, "Some");
                }
            }
        }

        private static SimpleEntity EmbarkationStatus(int id, string status) {
            return new SimpleEntity {
                Id = id,
                Description = status
            };
        }

    }

}