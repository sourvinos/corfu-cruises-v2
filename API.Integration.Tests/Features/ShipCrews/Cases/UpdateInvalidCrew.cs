using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace API.IntegrationTests.ShipCrews {

    public class UpdateInvalidCrew : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Gender_Must_Exist();
            yield return Nationality_Must_Exist();
            yield return Ship_Must_Exist();
        }

        private static object[] Gender_Must_Exist() {
            return new object[] {
                new TestCrew {
                    StatusCode = 457,
                    Id = 21,
                    GenderId = 5,
                    NationalityId = 1,
                    ShipId = 6,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01",
                }
            };
        }

        private static object[] Nationality_Must_Exist() {
            return new object[] {
                new TestCrew {
                    StatusCode = 456,
                    Id = 21,
                    GenderId = 1,
                    NationalityId = 999,
                    ShipId = 6,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01",
                }
            };
        }

        private static object[] Ship_Must_Exist() {
            return new object[] {
                new TestCrew {
                    StatusCode = 454,
                    Id = 21,
                    GenderId = 1,
                    NationalityId = 1,
                    ShipId = 99,
                    Lastname = Helpers.CreateRandomString(128),
                    Firstname = Helpers.CreateRandomString(128),
                    Birthdate = "1970-01-01"
                }
            };
        }

    }

}
