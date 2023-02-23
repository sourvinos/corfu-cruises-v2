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
        private readonly string _adminUrl = "/reservations/08da3032-efea-4de7-8a43-4800d3652fc8";
        private readonly string _baseUrl;
        private readonly string _notFoundUrl = "/reservations/b140036a-5b03-4098-9774-8878f252fdb7";
        private readonly string _simpleUserUrl_owned = "/reservations/08da31b2-a2e0-4923-8890-6631bd75e779";
        private readonly string _simpleUserUrl_not_owned = "/reservations/08da3187-afd4-4df3-8675-72360bf1ec90";

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
            await RecordNotFound.Action(_httpClient, _baseUrl, _notFoundUrl, "john", "ec11fc8c16da");
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
            await RecordFound.Action(_httpClient, _baseUrl, _adminUrl, "john", "ec11fc8c16da");
        }

    }

}