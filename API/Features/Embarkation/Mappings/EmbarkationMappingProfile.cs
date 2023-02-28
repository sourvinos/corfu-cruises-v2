using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Embarkation {

    public class EmbarkationMappingProfile : Profile {

        public EmbarkationMappingProfile() {
            CreateMap<Reservation, EmbarkationFinalVM>()
                .ForMember(x => x.Customer, x => x.MapFrom(x => new SimpleEntity { Id = x.Customer.Id, Description = x.Customer.Description }))
                .ForMember(x => x.Destination, x => x.MapFrom(x => new EmbarkationFinalDestinationListVM {
                    Id = x.Destination.Id,
                    Description = x.Destination.Description,
                    Abbreviation = x.Destination.Abbreviation
                }))
                .ForMember(x => x.Driver, x => x.MapFrom(x => new SimpleEntity {
                    Id = x.Driver != null ? x.Driver.Id : 0,
                    Description = x.Driver != null ? x.Driver.Description : "(EMPTY)"
                }))
                .ForMember(x => x.PickupPoint, x => x.MapFrom(x => new SimpleEntity { Id = x.PickupPoint.Id, Description = x.PickupPoint.Description }))
                .ForMember(x => x.Port, x => x.MapFrom(x => new EmbarkationFinalPortListVM {
                    Id = x.Port.Id,
                    Description = x.Port.Description,
                    Abbreviation = x.Port.Abbreviation
                }))
                .ForMember(x => x.Ship, x => x.MapFrom(x => new SimpleEntity { Id = x.Ship.Id, Description = x.Ship.Description }))
                .ForMember(x => x.TotalPax, x => x.MapFrom(x => x.TotalPax))
                .ForMember(x => x.EmbarkedPassengers, x => x.MapFrom(x => x.Passengers.Count(x => x.IsCheckedIn)))
                .ForMember(x => x.EmbarkationStatus, x => x.MapFrom(x => x.TotalPax - x.Passengers.Count(x => x.IsCheckedIn) == 0 ? new SimpleEntity { Id = 1, Description = "OK" } : x.Passengers.All(x => !x.IsCheckedIn) ? new SimpleEntity { Id = 2, Description = "PENDING" } : new SimpleEntity { Id = 3, Description = "OKPENDING" }))
                .ForMember(x => x.PassengerIds, x => x.MapFrom(x => x.Passengers.Select(x => x.Id)))
                .ForMember(x => x.Passengers, x => x.MapFrom(x => x.Passengers.Select(passenger => new EmbarkationFinalPassengerVM {
                    Id = passenger.Id,
                    Lastname = passenger.Lastname,
                    Firstname = passenger.Firstname,
                    NationalityCode = passenger.Nationality.Code,
                    NationalityDescription = passenger.Nationality.Description,
                    IsCheckedIn = passenger.IsCheckedIn
                })));
        }

    }


}