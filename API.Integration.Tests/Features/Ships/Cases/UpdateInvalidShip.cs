using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace Ships {

    public class UpdateInvalidShip : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ShipOwner_Must_Exist();
        }

        private static object[] ShipOwner_Must_Exist() {
            return new object[] {
                new TestShip {
                    Id = 6,
                    StatusCode = 449,
                    ShipOwnerId = 7,
                    Description = Helpers.CreateRandomString(5),
                }
            };
        }

    }

}
