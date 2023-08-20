using API.Infrastructure.Helpers;
using AutoMapper;
using System;

namespace API.Features.Customers {

    public class CustomerMappingProfile : Profile {

        public CustomerMappingProfile() {
            CreateMap<Customer, CustomerListVM>();
            CreateMap<Customer, CustomerActiveVM>();
            CreateMap<Customer, CustomerReadDto>();
            CreateMap<CustomerWriteDto, Customer>()
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
        }

    }

}