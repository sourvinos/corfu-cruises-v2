using System;
using API.Features.CoachRoutes;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.PickupPoints {

    public class PickupPointMappingProfile : Profile {

        public PickupPointMappingProfile() {
            // List
            CreateMap<PickupPoint, PickupPointListVM>()
                .ForMember(x => x.CoachRoute, x => x.MapFrom(x => new PickupPointListCoachRouteVM {
                    Id = x.CoachRoute.Id,
                    Abbreviation = x.CoachRoute.Abbreviation
                }));
            // Active
            CreateMap<PickupPoint, PickupPointActiveVM>()
                .ForMember(x => x.Id, x => x.MapFrom(x => x.Id))
                .ForMember(x => x.Description, x => x.MapFrom(x => x.Description))
                .ForMember(x => x.ExactPoint, x => x.MapFrom(x => x.ExactPoint))
                .ForMember(x => x.Time, x => x.MapFrom(x => x.Time))
                .ForMember(x => x.Port, x => x.MapFrom(x => new SimpleEntity {
                    Id = x.CoachRoute.Port.Id,
                    Description = x.CoachRoute.Port.Description
                }));
            // Read
            CreateMap<PickupPoint, PickupPointReadDto>()
                .ForMember(x => x.CoachRoute, x => x.MapFrom(x => new CoachRouteActiveVM {
                    Id = x.CoachRoute.Id,
                    Abbreviation = x.CoachRoute.Abbreviation
                }));
            // Write
            CreateMap<PickupPointWriteDto, PickupPoint>()
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
        }

    }

}