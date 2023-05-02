using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using Infrastructure;
using Responses;
using Xunit;

namespace Genders {

    [Collection("Sequence")]
    public class Genders02GetActive : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _baseUrl;
        private readonly string _url = "/genders/getActive";

        #endregion

        public Genders02GetActive(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task OpenToAll() {
            var actionResponse = await ListAll.Action(_httpClient, _baseUrl, _url);
            var records = JsonSerializer.Deserialize<List<SimpleEntity>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.Equal(3, records.Count);
        }

    }

}