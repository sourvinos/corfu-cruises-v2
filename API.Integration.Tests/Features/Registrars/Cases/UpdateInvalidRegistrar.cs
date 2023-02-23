using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace Registrars {

    public class UpdateInvalidRegistrar : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Ship_Must_Exist();
        }

        private static object[] Ship_Must_Exist() {
            return new object[] {
                new TestRegistrar {
                    StatusCode = 454,
                    Id = 7,
                    ShipId = 99,
                    Fullname = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
