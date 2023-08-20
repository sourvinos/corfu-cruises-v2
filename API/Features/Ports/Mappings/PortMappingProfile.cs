using API.Infrastructure.Helpers;
using AutoMapper;
using System;

namespace API.Features.Ports {

    public class PortMappingProfile : Profile {

        public PortMappingProfile() {
            CreateMap<Port, PortListVM>();
            CreateMap<Port, PortActiveVM>();
            CreateMap<Port, PortReadDto>();
            CreateMap<PortWriteDto, Port>()
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
        }

    }

}