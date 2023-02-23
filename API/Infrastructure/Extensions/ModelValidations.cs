using API.Features.CoachRoutes;
using API.Features.Customers;
using API.Features.Destinations;
using API.Features.Drivers;
using API.Features.Genders;
using API.Features.Nationalities;
using API.Features.PickupPoints;
using API.Features.Ports;
using API.Features.Registrars;
using API.Features.Reservations;
using API.Features.Schedules;
using API.Features.ShipCrews;
using API.Features.ShipRoutes;
using API.Features.Ships;
using API.Features.Users;
using API.Infrastructure.Account;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace API.Infrastructure.Extensions {

    public static class ModelValidations {

        public static void AddModelValidation(IServiceCollection services) {
            // Account
            services.AddTransient<IValidator<ChangePasswordVM>, ChangePasswordValidator>();
            services.AddTransient<IValidator<ForgotPasswordVM>, ForgotPasswordValidator>();
            services.AddTransient<IValidator<ResetPasswordVM>, ResetPasswordValidator>();
            // Tables
            services.AddTransient<IValidator<CoachRouteWriteDto>, CoachRouteValidator>();
            services.AddTransient<IValidator<CustomerWriteDto>, CustomerValidator>();
            services.AddTransient<IValidator<DestinationWriteDto>, DestinationValidator>();
            services.AddTransient<IValidator<DriverWriteDto>, DriverValidator>();
            services.AddTransient<IValidator<GenderWriteDto>, GenderValidator>();
            services.AddTransient<IValidator<NationalityWriteDto>, NationalityValidator>();
            services.AddTransient<IValidator<PickupPointWriteDto>, PickupPointValidator>();
            services.AddTransient<IValidator<PortWriteDto>, PortValidator>();
            services.AddTransient<IValidator<RegistrarWriteDto>, RegistrarValidator>();
            services.AddTransient<IValidator<ReservationWriteDto>, ReservationValidator>();
            services.AddTransient<IValidator<ScheduleWriteDto>, ScheduleValidator>();
            services.AddTransient<IValidator<ShipCrewWriteDto>, ShipCrewValidator>();
            services.AddTransient<IValidator<ShipRouteWriteDto>, ShipRouteValidator>();
            services.AddTransient<IValidator<ShipWriteDto>, ShipValidator>();
            // Users
            services.AddTransient<IValidator<UserNewDto>, UserNewValidator>();
            services.AddTransient<IValidator<UserUpdateDto>, UserUpdateValidator>();
        }

    }

}