using System.Collections;
using System.Collections.Generic;

namespace Users {

    public class UpdateValidUser : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidModel();
        }

        private static object[] ValidModel() {
            return new object[] {
                new TestUpdateUser {
                    Id = "eae03de1-6742-4015-9d52-102dba5d7365",
                    CustomerId = 2,
                    UserName = "simpleuser",
                    Displayname = "Simple User",
                    Email = "email@server.com",
                    IsAdmin = false,
                    IsActive = true
                }
            };
        }

    }

}
