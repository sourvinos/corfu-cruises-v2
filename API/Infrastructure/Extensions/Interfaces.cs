using API.Features.Availability;
using API.Features.CoachRoutes;
using API.Features.Customers;
using API.Features.Destinations;
using API.Features.Drivers;
using API.Features.Embarkation;
using API.Features.Genders;
using API.Features.Ledger;
using API.Features.Manifest;
using API.Features.Nationalities;
using API.Features.PickupPoints;
using API.Features.Ports;
using API.Features.Registrars;
using API.Features.Reservations;
using API.Features.Schedules;
using API.Features.ShipCrews;
using API.Features.ShipOwners;
using API.Features.ShipRoutes;
using API.Features.Ships;
using API.Features.Users;
using API.Infrastructure.Auth;
using Microsoft.Extensions.DependencyInjection;

namespace API.Infrastructure.Extensions
{

    public static class Interfaces {

        public static void AddInterfaces(IServiceCollection services) {
            services.AddScoped<Token>();
            // Tables
            services.AddTransient<ICoachRouteRepository, CoachRouteRepository>();
            services.AddTransient<ICustomerRepository, CustomerRepository>();
            services.AddTransient<IDestinationRepository, DestinationRepository>();
            services.AddTransient<IDriverRepository, DriverRepository>();
            services.AddTransient<IGenderRepository, GenderRepository>();
            services.AddTransient<IGenderRepository, GenderRepository>();
            services.AddTransient<INationalityRepository, NationalityRepository>();
            services.AddTransient<IPickupPointRepository, PickupPointRepository>();
            services.AddTransient<IPortRepository, PortRepository>();
            services.AddTransient<IRegistrarRepository, RegistrarRepository>();
            services.AddTransient<IScheduleRepository, ScheduleRepository>();
            services.AddTransient<IShipCrewRepository, ShipCrewRepository>();
            services.AddTransient<IShipOwnerRepository, ShipOwnerRepository>();
            services.AddTransient<IShipRepository, ShipRepository>();
            services.AddTransient<IShipRouteRepository, ShipRouteRepository>();
            services.AddTransient<IUserRepository, UserRepository>();
            // Validations
            services.AddTransient<ICoachRouteValidation, CoachRouteValidation>();
            services.AddTransient<IPickupPointValidation, PickupPointValidation>();
            services.AddTransient<IPortValidation, PortValidation>();
            services.AddTransient<IRegistrarValidation, RegistrarValidation>();
            services.AddTransient<IReservationValidation, ReservationValidation>();
            services.AddTransient<IScheduleValidation, ScheduleValidation>();
            services.AddTransient<IShipCrewValidation, ShipCrewValidation>();
            services.AddTransient<IShipValidation, ShipValidation>();
            services.AddTransient<IUserValidation<IUser>, UserValidation>();
            // Tasks
            services.AddTransient<IAvailabilityCalendar, AvailabilityCalendar>();
            services.AddTransient<IEmbarkationRepository, EmbarkationRepository>();
            services.AddTransient<ILedgerRepository, LedgerRepository>();
            services.AddTransient<IManifestRepository, ManifestRepository>();
            services.AddTransient<IReservationCalendar, ReservationCalendar>();
            services.AddTransient<IReservationReadRepository, ReservationReadRepository>();
            services.AddTransient<IReservationUpdateRepository, ReservationUpdateRepository>();
        }

    }

}

