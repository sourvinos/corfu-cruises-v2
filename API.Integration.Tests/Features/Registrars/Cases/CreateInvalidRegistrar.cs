using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace Registrars {

    public class CreateInvalidRegistrar : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Ship_Must_Exist();
            yield return Ship_Must_Be_Active();
        }

        private static object[] Ship_Must_Exist() {
            return new object[] {
                new TestRegistrar {
                    StatusCode = 454,
                    ShipId = 99,
                    Fullname = Helpers.CreateRandomString(128)
                }
            };
        }

        private static object[] Ship_Must_Be_Active() {
            return new object[] {
                new TestRegistrar {
                    StatusCode = 454,
                    ShipId = 8,
                    Fullname = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
