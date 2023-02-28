using System;
using System.Linq;
using API.Features.Drivers;
using API.Features.PickupPoints;
using API.Features.Ships;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.Reservations {

    public class ReservationMappingProfile : Profile {

        public ReservationMappingProfile() {
            // List
            CreateMap<Reservation, ReservationListVM>()
                .ForMember(x => x.Date, x => x.MapFrom(x => DateHelpers.DateToISOString(x.Date)))
                .ForMember(x => x.Customer, x => x.MapFrom(x => new SimpleEntity {
                    Id = x.Customer.Id,
                    Description = x.Customer.Description
                }))
                .ForMember(x => x.CoachRoute, x => x.MapFrom(x => new CoachRouteListVM {
                    Id = x.PickupPoint.CoachRoute.Id,
                    Description = x.PickupPoint.CoachRoute.Description,
                    Abbreviation = x.PickupPoint.CoachRoute.Abbreviation
                }))
                .ForMember(x => x.Destination, x => x.MapFrom(x => new DestinationListVM {
                    Id = x.Destination.Id,
                    Description = x.Destination.Description,
                    Abbreviation = x.Destination.Abbreviation
                }))
                .ForMember(x => x.PickupPoint, x => x.MapFrom(x => new PickupPointListVM {
                    Id = x.PickupPoint.Id,
                    Description = x.PickupPoint.Description,
                    Time = x.PickupPoint.Time
                }))
                .ForMember(x => x.Driver, x => x.MapFrom(x => new DriverListVM {
                    Id = x.Driver == null ? 0 : x.Driver.Id,
                    Description = x.Driver == null ? "(EMPTY)" : x.Driver.Description,
                    Phones = x.Driver == null ? "(EMPTY)" : x.Driver.Phones
                }))
                .ForMember(x => x.Port, x => x.MapFrom(x => new PortListVM {
                    Id = x.Port.Id,
                    Description = x.Port.Description,
                    Abbreviation = x.Port.Abbreviation
                }))
                .ForMember(x => x.Ship, x => x.MapFrom(x => new SimpleEntity {
                    Id = x.Ship == null ? 0 : x.Ship.Id,
                    Description = x.Ship == null ? "(EMPTY)" : x.Ship.Description
                }))
                .ForMember(x => x.PassengerCount, x => x.MapFrom(x => x.Passengers.Count))
                .ForMember(x => x.PassengerDifference, x => x.MapFrom(x => x.TotalPax - x.Passengers.Count));
            // DriverList
            CreateMap<Reservation, ReservationDriverListVM>()
                .ForMember(x => x.ExactPoint, x => x.MapFrom(x => x.PickupPoint.ExactPoint))
                .ForMember(x => x.Time, x => x.MapFrom(x => x.PickupPoint.Time))
                .ForMember(x => x.Fullname, x => x.MapFrom(x => x.Passengers.FirstOrDefault().Lastname + " " + x.Passengers.FirstOrDefault().Firstname));
            // Read reservation
            CreateMap<Reservation, ReservationReadDto>()
                .ForMember(x => x.Date, x => x.MapFrom(x => DateHelpers.DateToISOString(x.Date)))
                .ForMember(x => x.Driver, x => x.NullSubstitute(new Driver { Id = 0, Description = "(EMPTY)" }))
                .ForMember(x => x.Ship, x => x.NullSubstitute(new Ship { Id = 0, Description = "(EMPTY)" }))
                .ForMember(x => x.PickupPoint, x => x.MapFrom(r => new PickupPointActiveVM {
                    Id = r.PickupPoint.Id,
                    Description = r.PickupPoint.Description,
                    ExactPoint = r.PickupPoint.ExactPoint,
                    Time = r.PickupPoint.Time,
                    Port = new SimpleEntity {
                        Id = r.PickupPoint.CoachRoute.Port.Id,
                        Description = r.PickupPoint.CoachRoute.Port.Description
                    }
                }));
            // Read passenger
            CreateMap<Passenger, PassengerReadDto>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => DateHelpers.DateToISOString(x.Birthdate)))
                .ForMember(x => x.Nationality, x => x.MapFrom(x => new NationalityDto {
                    Id = x.Nationality.Id,
                    Description = x.Nationality.Description,
                    Code = x.Nationality.Code
                }));
            // Write reservation
            CreateMap<ReservationWriteDto, Reservation>()
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
            // Write passenger
            CreateMap<PassengerWriteDto, Passenger>()
                .ForMember(x => x.OccupantId, x => x.MapFrom(x => 2));
        }

    }

}