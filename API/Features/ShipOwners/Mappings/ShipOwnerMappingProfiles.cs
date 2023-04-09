using System;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.ShipOwners {

    public class ShipOwnerMappingProfile : Profile {

        public ShipOwnerMappingProfile() {
            CreateMap<ShipOwner, ShipOwnerListVM>();
            CreateMap<ShipOwner, ShipOwnerActiveVM>();
            CreateMap<ShipOwner, ShipOwnerReadDto>();
            CreateMap<ShipOwnerWriteDto, ShipOwner>()
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
        }

    }

}