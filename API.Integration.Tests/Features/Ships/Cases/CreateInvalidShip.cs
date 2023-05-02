using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace Ships {

    public class CreateInvalidShip : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ShipOwner_Must_Exist();
            yield return ShipOwner_Must_Be_Active();
        }

        private static object[] ShipOwner_Must_Exist() {
            return new object[] {
                new TestShip {
                    StatusCode = 449,
                    ShipOwnerId = 1,
                    Description = Helpers.CreateRandomString(5),
                }
            };
        }

        private static object[] ShipOwner_Must_Be_Active() {
            return new object[] {
                new TestShip {
                    StatusCode = 449,
                    ShipOwnerId = 7,
                    Description = Helpers.CreateRandomString(5),
                }
            };
        }

    }

}
