using System.Net.Http;
using System.Threading.Tasks;
using Cases;
using Infrastructure;
using Responses;
using Xunit;

namespace Reservations {

    [Collection("Sequence")]
    public class Reservations07Delete : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "delete";
        private readonly string _baseUrl;
        private readonly string _notFoundUrl = "/reservations/b140036a-5b03-4098-9774-8878f252fdb7";
        private readonly string _url = "/reservations";
        private readonly string _deleteUrl = "/reservations/08da32ab-8ef2-42e4-85c5-6760c02b81c1";

        #endregion

        public Reservations07Delete(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task Unauthorized_Not_Logged_In() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _deleteUrl, _actionVerb, "", "", null);
        }

        [Fact]
        public async Task Unauthorized_Invalid_Credentials() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _deleteUrl, _actionVerb, "user-does-not-exist", "not-a-valid-password", null);
        }

        [Theory]
        [ClassData(typeof(InactiveUsersCanNotLogin))]
        public async Task Unauthorized_Inactive_Users(Login login) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _deleteUrl, _actionVerb, login.Username, login.Password, null);
        }

        [Fact]
        public async Task Admins_Not_Found_When_Not_Exists() {
            await RecordNotFound.Action(_httpClient, _baseUrl, _notFoundUrl, "john", "ec11fc8c16da");
        }

        [Fact]
        public async Task Simple_Users_Can_Not_Delete() {
            await Forbidden.Action(_httpClient, _baseUrl, _deleteUrl, _actionVerb, "simpleuser", "1234567890", null);
        }

        [Theory]
        [ClassData(typeof(ActiveAdminsCanDeleteOwnedByAnyone))]
        public async Task Admins_Can_Delete(TestNewReservation record) {
            await RecordDeleted.Action(_httpClient, _baseUrl, _url + "/" + record.ReservationId.ToString(), "john", "ec11fc8c16da");
        }

    }

}