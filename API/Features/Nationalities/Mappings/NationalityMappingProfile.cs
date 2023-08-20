using API.Infrastructure.Helpers;
using AutoMapper;
using System;

namespace API.Features.Nationalities {

    public class NationalityMappingProfile : Profile {

        public NationalityMappingProfile() {
            CreateMap<Nationality, NationalityListVM>();
            CreateMap<Nationality, NationalityActiveVM>();
            CreateMap<Nationality, NationalityReadDto>();
            CreateMap<NationalityWriteDto, Nationality>()
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
        }

    }

}