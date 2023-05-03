using System.Net.Http;
using System.Threading.Tasks;
using Cases;
using Infrastructure;
using Responses;
using Xunit;

namespace Reservations {

    [Collection("Sequence")]
    public class Reservations03GetByReservationId : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "get";
        private readonly string _adminUrl = "/reservations/08da8845-1ad1-48ed-8e25-c7ef15bf6861";
        private readonly string _baseUrl;
        private readonly string _notFoundUrl = "/reservations/b140036a-5b03-4098-9774-8878f252fdb7";
        private readonly string _simpleUserUrl_owned = "/reservations/08da9633-8a72-4662-8b48-f3d824e15edc";
        private readonly string _simpleUserUrl_not_owned = "/reservations/08da46ea-3cb1-41f3-8b9a-11487671246b";

        #endregion

        public Reservations03GetByReservationId(AppSettingsFixture appsettings) {
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
        public async Task Active_Users_Not_Found_When_Not_Exists() {
            await RecordNotFound.Action(_httpClient, _baseUrl, _notFoundUrl, "john", "ec11fc8c16db");
        }

        [Fact]
        public async Task Simple_Users_Can_Not_Get_By_Reservation_Id_Not_Owned() {
            await RecordNotOwned.Action(_httpClient, _baseUrl, _simpleUserUrl_not_owned, "simpleuser", "1234567890");
        }

        [Fact]
        public async Task Simple_Users_Can_Get_By_Reservation_Id_If_Owned() {
            await RecordFound.Action(_httpClient, _baseUrl, _simpleUserUrl_owned, "simpleuser", "1234567890");
        }

        [Fact]
        public async Task Admins_Can_Get_By_Reservation_Id() {
            await RecordFound.Action(_httpClient, _baseUrl, _adminUrl, "john", "ec11fc8c16db");
        }

    }

}