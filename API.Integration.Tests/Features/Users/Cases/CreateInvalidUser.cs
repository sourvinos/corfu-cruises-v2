using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace Users {

    public class CreateInvalidUser : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Customer_Must_Be_Active();
            yield return Customer_Must_Exist();
            yield return EmailAlreadyExists();
            yield return UsernameAlreadyExists();
        }

        private static object[] Customer_Must_Be_Active() {
            return new object[] {
                new TestNewUser {
                    StatusCode = 450,
                    CustomerId = 195,
                    UserName = Helpers.CreateRandomString(128),
                    Displayname = Helpers.CreateRandomString(128),
                    Email = "email@server.com",
                    Password = "abcd1234",
                    ConfirmPassword = "abcd1234"
                }
            };
        }

        private static object[] Customer_Must_Exist() {
            return new object[] {
                new TestNewUser {
                    StatusCode = 450,
                    CustomerId = 3,
                    UserName = Helpers.CreateRandomString(128),
                    Displayname = Helpers.CreateRandomString(128),
                    Email = "email@server.com",
                    Password = "abcd1234",
                    ConfirmPassword = "abcd1234"
                }
            };
        }

        private static object[] EmailAlreadyExists() {
            return new object[] {
                new TestNewUser {
                    StatusCode = 492,
                    UserName = "newuser",
                    Displayname = "New User",
                    CustomerId = 2,
                    Email = "operations.corfucruises@gmail.com",
                    Password = "1234567890",
                    ConfirmPassword = "1234567890",
                    IsAdmin = false,
                    IsActive = true
                }
            };
        }

        private static object[] UsernameAlreadyExists() {
            return new object[] {
                new TestNewUser {
                    StatusCode = 492,
                    UserName = "foteini",
                    Displayname = "FOTEINI",
                    CustomerId = 2,
                    Email = "newemail@server.com",
                    Password = "1234567890",
                    ConfirmPassword = "1234567890",
                    IsAdmin = false,
                    IsActive = true
                }
            };
        }

    }

}
