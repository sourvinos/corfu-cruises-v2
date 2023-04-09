using System;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.ShipRoutes {

    public class ShipRouteMappingProfile : Profile {

        public ShipRouteMappingProfile() {
            CreateMap<ShipRoute, ShipRouteListVM>();
            CreateMap<ShipRoute, ShipRouteActiveVM>();
            CreateMap<ShipRoute, ShipRouteReadDto>();
            CreateMap<ShipRouteWriteDto, ShipRoute>()
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
        }

    }

}