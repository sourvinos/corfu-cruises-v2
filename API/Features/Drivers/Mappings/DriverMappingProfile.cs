using System;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.Drivers {

    public class DriverMappingProfile : Profile {

        public DriverMappingProfile() {
            CreateMap<Driver, DriverListVM>();
            CreateMap<Driver, DriverActiveVM>();
            CreateMap<Driver, DriverReadDto>();
            CreateMap<DriverWriteDto, Driver>()
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
        }

    }

}