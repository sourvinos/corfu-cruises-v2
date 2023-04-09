using System;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.Destinations {

    public class DestinationMappingProfile : Profile {

        public DestinationMappingProfile() {
            CreateMap<Destination, DestinationListVM>();
            CreateMap<Destination, DestinationActiveVM>();
            CreateMap<Destination, DestinationReadDto>();
            CreateMap<DestinationWriteDto, Destination>()
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
        }

    }

}