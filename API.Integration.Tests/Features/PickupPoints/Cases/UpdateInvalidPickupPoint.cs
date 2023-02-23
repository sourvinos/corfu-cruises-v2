using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace API.IntegrationTests.PickupPoints {

    public class UpdateInvalidPickupPoint : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Route_Must_Exist();
        }

        private static object[] Route_Must_Exist() {
            return new object[] {
                new TestPickupPoint {
                    StatusCode = 408,
                    Id = 1,
                    CoachRouteId = 99,
                    Description = Helpers.CreateRandomString(128),
                    ExactPoint = Helpers.CreateRandomString(128),
                    Time = "08:00",
                    Coordinates = Helpers.CreateRandomString(128),
                    IsActive = true
                }
            };
        }

    }

}
