using System;
using System.IO;
using Microsoft.Extensions.Configuration;

namespace Infrastructure {

    public class AppSettingsFixture : IDisposable {

        public IConfigurationRoot Configuration;

        public AppSettingsFixture() {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public void Dispose() {
            GC.SuppressFinalize(this);
        }

    }

}