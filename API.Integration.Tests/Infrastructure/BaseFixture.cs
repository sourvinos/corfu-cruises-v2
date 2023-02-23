using Xunit;

namespace Infrastructure {

    public class BaseFixture : IClassFixture<AppSettingsFixture> {

        public AppSettingsFixture AppSettingsFixture;
        public string BaseUrl;

        public BaseFixture(AppSettingsFixture appSettings) {
            this.AppSettingsFixture = appSettings;
            this.BaseUrl = AppSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
        }

    }

}
