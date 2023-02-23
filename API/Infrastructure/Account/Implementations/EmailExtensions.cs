using Microsoft.Extensions.DependencyInjection;

namespace API.Infrastructure.Account {

    public static class AddEmailExtensions {

        public static IServiceCollection AddEmailSenders(this IServiceCollection services) {

            services.AddTransient<IEmailSender, EmailSender>();

            return services;

        }

    }

}