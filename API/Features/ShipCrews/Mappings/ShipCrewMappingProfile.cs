using System;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.ShipCrews {

    public class ShipCrewMappingProfile : Profile {

        public ShipCrewMappingProfile() {
            // List
            CreateMap<ShipCrew, ShipCrewListVM>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => DateHelpers.DateToISOString(x.Birthdate)))
                .ForMember(x => x.Ship, x => x.MapFrom(x => new SimpleEntity {
                    Id = x.Ship.Id,
                    Description = x.Ship.Description
                }));
            // Read
            CreateMap<ShipCrew, ShipCrewReadDto>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => DateHelpers.DateToISOString(x.Birthdate)))
                .ForMember(x => x.Ship, x => x.MapFrom(x => new { x.Ship.Id, x.Ship.Description }))
                .ForMember(x => x.Nationality, x => x.MapFrom(x => new { x.Nationality.Id, x.Nationality.Description }))
                .ForMember(x => x.Gender, x => x.MapFrom(x => new { x.Gender.Id, x.Gender.Description }));
            // Write
            CreateMap<ShipCrewWriteDto, ShipCrew>()
                .ForMember(x => x.OccupantId, x => x.MapFrom(x => 1))
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
            CreateMap<ShipCrew, ShipCrewActiveVM>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => DateHelpers.DateToISOString(x.Birthdate)));
        }

    }

}