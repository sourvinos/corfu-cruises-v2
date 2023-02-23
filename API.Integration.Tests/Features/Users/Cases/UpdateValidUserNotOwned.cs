using System.Collections;
using System.Collections.Generic;

namespace Users {

    public class UpdateValidUserNotOwnRecord : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return AccountIsOwnedByAnotherUser();
        }

        private static object[] AccountIsOwnedByAnotherUser() {
            return new object[] {
                new TestUpdateUser {
                    StatusCode = 490,
                    Id = "ce637d02-3076-4a96-b6f6-1e3a0841b81e",
                    CustomerId = 2,
                    UserName = "foteini",
                    Displayname = "Foteini",
                    Email = "operations.corfucruises@gmail.com",
                    IsAdmin = true,
                    IsActive = true
                }
            };
        }

    }

}
