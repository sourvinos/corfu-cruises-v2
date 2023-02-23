using System.Collections;
using System.Collections.Generic;

namespace Users {

    public class UpdateInvalidUser : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return UsernameAlreadyExists();
            yield return EmailAlreadyExists();
        }

        private static object[] UsernameAlreadyExists() {
            return new object[] {
                new TestUpdateUser {
                    StatusCode = 498,
                    Id = "eae03de1-6742-4015-9d52-102dba5d7365",
                    CustomerId = 2,
                    UserName = "foteini",
                    Displayname = "FOTEINI",
                    Email = "email@server.com",
                    IsAdmin = false,
                    IsActive = true
                }
            };
        }

        private static object[] EmailAlreadyExists() {
            return new object[] {
                new TestUpdateUser {
                    StatusCode = 498,
                    Id = "eae03de1-6742-4015-9d52-102dba5d7365",
                    UserName = "simpleuser",
                    Displayname = "Simple User",
                    CustomerId = 2,
                    Email = "operations.corfucruises@gmail.com",
                    IsAdmin = false,
                    IsActive = true
                }
            };
        }

    }

}
