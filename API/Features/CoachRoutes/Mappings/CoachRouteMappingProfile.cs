using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using AutoMapper;
using System;

namespace API.Features.CoachRoutes {

    public class CoachRouteMappingProfile : Profile {

        public CoachRouteMappingProfile() {
            CreateMap<CoachRoute, CoachRouteListVM>();
            CreateMap<CoachRoute, CoachRouteActiveVM>();
            CreateMap<CoachRoute, CoachRouteReadDto>()
                .ForMember(x => x.Port, x => x.MapFrom(x => new SimpleEntity { Id = x.Port.Id, Description = x.Port.Description }));
            CreateMap<CoachRouteWriteDto, CoachRoute>()
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
        }

    }

}