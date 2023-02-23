using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace CoachRoutes {

    public class UpdateInvalidCoachRoute : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Port_Must_Exist();
            yield return Port_Must_Be_Active();
        }

        private static object[] Port_Must_Exist() {
            return new object[] {
                new TestCoachRoute {
                    StatusCode = 450,
                    Id = 1,
                    PortId = 99,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation = Helpers.CreateRandomString(10)
                }
            };
        }

        private static object[] Port_Must_Be_Active() {
            return new object[] {
                new TestCoachRoute {
                    StatusCode = 450,
                    Id = 9,
                    PortId = 99,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation = Helpers.CreateRandomString(10)
                }
            };
        }

    }

}
