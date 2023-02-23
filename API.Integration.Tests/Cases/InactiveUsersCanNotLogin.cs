using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace Cases {

    public class InactiveUsersCanNotLogin : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return InSimple_Users_Can_Not_Login();
            yield return InAdmins_Can_Not_Login();
        }

        private static object[] InSimple_Users_Can_Not_Login() {
            return new object[] {
                new Login {
                    Username = "marios",
                    Password = "2b24a7368e19",
                }
            };
        }

        private static object[] InAdmins_Can_Not_Login() {
            return new object[] {
                new Login {
                    Username = "nikoleta",
                    Password = "8dd193508e05"
                }
            };
        }

    }

}
