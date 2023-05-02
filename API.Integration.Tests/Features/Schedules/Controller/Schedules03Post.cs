using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Cases;
using Infrastructure;
using Responses;
using Xunit;

namespace Schedules {

    [Collection("Sequence")]
    public class Schedules03Post : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "post";
        private readonly string _baseUrl;
        private readonly string _url = "/schedules";

        #endregion

        public Schedules03Post(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(CreateValidSchedule))]
        public async Task Unauthorized_Not_Logged_In(NewTestSchedule record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "", "", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidSchedule))]
        public async Task Unauthorized_Invalid_Credentials(NewTestSchedule record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "user-does-not-exist", "not-a-valid-password", record);
        }

        [Theory]
        [ClassData(typeof(InactiveUsersCanNotLogin))]
        public async Task Unauthorized_Inactive_Users(Login login) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, login.Username, login.Password, null);
        }

        [Theory]
        [ClassData(typeof(CreateValidSchedule))]
        public async Task Simple_Users_Can_Not_Create(NewTestSchedule record) {
            await Forbidden.Action(_httpClient, _baseUrl, _url, _actionVerb, "simpleuser", "1234567890", record);
        }

        [Theory]
        [ClassData(typeof(CreateInvalidSchedule))]
        public async Task Admins_Can_Not_Create_When_Invalid(NewTestSchedule record) {
            var actionResponse = await RecordInvalidNotSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "john", "ec11fc8c16db", record.TestScheduleBody);
            Assert.Equal((HttpStatusCode)record.StatusCode, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(CreateValidSchedule))]
        public async Task Admins_Can_Create_When_Valid(NewTestSchedule record) {
            await RecordSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "john", "ec11fc8c16db", record.TestScheduleBody);
        }

    }

}