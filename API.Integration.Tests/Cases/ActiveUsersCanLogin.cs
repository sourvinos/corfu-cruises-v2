using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace Cases {

    public class ActiveUsersCanLogin : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_Login();
            yield return Admins_Can_Login();
        }

        private static object[] Simple_Users_Can_Login() {
            return new object[] {
                new Login {
                    Username = "simpleuser",
                    Password = "1234567890"
                }
            };
        }

        private static object[] Admins_Can_Login() {
            return new object[] {
                new Login {
                    Username = "john",
                    Password = "ec11fc8c16db"
                }
            };
        }

    }

}
