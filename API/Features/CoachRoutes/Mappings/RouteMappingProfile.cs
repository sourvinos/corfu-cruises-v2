using System;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.CoachRoutes {

    public class RouteMappingProfile : Profile {

        public RouteMappingProfile() {
            CreateMap<CoachRouteWriteDto, CoachRoute>()
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
        }

    }

}