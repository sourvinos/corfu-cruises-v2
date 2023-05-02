using System.Net.Http;
using System.Threading.Tasks;
using Infrastructure;
using Xunit;
using Responses;
using Cases;

namespace Users {

    [Collection("Sequence")]
    public class Users02GetById : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "get";
        private readonly string _baseUrl;
        private readonly string _notFoundUrl = "/users/582ea0d8-3938-4098-a381-4721d560b141";
        private readonly string _url = "/users/eae03de1-6742-4015-9d52-102dba5d7365";
        private readonly string _simpleUserUrl_not_owned = "/users/582ea0d8-3938-4098-a381-4721d560b145";

        #endregion

        public Users02GetById(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task Unauthorized_Not_Logged_In() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "", "", null);
        }

        [Fact]
        public async Task Unauthorized_Invalid_Credentials() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "user-does-not-exist", "not-a-valid-password", null);
        }

        [Theory]
        [ClassData(typeof(InactiveUsersCanNotLogin))]
        public async Task Unauthorized_Inactive_Users(Login login) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, login.Username, login.Password, null);
        }

        [Fact]
        public async Task Simple_Users_Can_Not_Get_By_Id_If_Not_Owned() {
            await RecordNotOwned.Action(_httpClient, _baseUrl, _simpleUserUrl_not_owned, "simpleuser", "1234567890");
        }

        [Fact]
        public async Task Simple_Users_Can_Get_By_Id_If_Owned() {
            await RecordFound.Action(_httpClient, _baseUrl, _url, "john", "ec11fc8c16db");
        }

        [Fact]
        public async Task Admins_Not_Found_When_Not_Exists() {
            await RecordNotFound.Action(_httpClient, _baseUrl, _notFoundUrl, "john", "ec11fc8c16db");
        }

        [Fact]
        public async Task Admins_Can_Get_By_Id() {
            await RecordFound.Action(_httpClient, _baseUrl, _url, "john", "ec11fc8c16db");
        }

    }

}