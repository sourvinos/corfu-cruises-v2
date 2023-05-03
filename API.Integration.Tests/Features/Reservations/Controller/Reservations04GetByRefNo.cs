using System.Net.Http;
using System.Threading.Tasks;
using Cases;
using Infrastructure;
using Responses;
using Xunit;

namespace Reservations {

    [Collection("Sequence")]
    public class Reservations04GetByRefNo : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "get";
        private readonly string _adminUrl = "/reservations/refNo/blc21409";
        private readonly string _baseUrl;
        private readonly string _notFoundUrl = "/reservations/refNo/pa685";
        private readonly string _simpleUserUrl_not_owned = "/reservations/refNo/bl3505";
        private readonly string _simpleUserUrl_owned = "/reservations/refNo/pa24963";

        #endregion

        public Reservations04GetByRefNo(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task Unauthorized_Not_Logged_In() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _adminUrl, _actionVerb, "", "", null);
        }

        [Fact]
        public async Task Unauthorized_Invalid_Credentials() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _adminUrl, _actionVerb, "user-does-not-exist", "not-a-valid-password", null);
        }

        [Theory]
        [ClassData(typeof(InactiveUsersCanNotLogin))]
        public async Task Unauthorized_Inactive_Users(Login login) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _adminUrl, _actionVerb, login.Username, login.Password, null);
        }

        [Fact]
        public async Task Active_Users_Get_Empty_List_If_Not_Exists() {
            await RecordFound.Action(_httpClient, _baseUrl, _notFoundUrl, "john", "ec11fc8c16db");
        }

        [Fact]
        public async Task Simple_Users_Get_Empty_List_If_Not_Owned() {
            await RecordFound.Action(_httpClient, _baseUrl, _simpleUserUrl_not_owned, "simpleuser", "1234567890");
        }

        [Fact]
        public async Task Simple_Users_Can_Get_By_RefNo_If_Owned() {
            await RecordFound.Action(_httpClient, _baseUrl, _simpleUserUrl_owned, "simpleuser", "1234567890");
        }

        [Fact]
        public async Task Admins_Can_Get_By_RefNo() {
            await RecordFound.Action(_httpClient, _baseUrl, _adminUrl, "john", "ec11fc8c16db");
        }

    }

}