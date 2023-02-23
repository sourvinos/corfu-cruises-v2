using System.Collections;
using System.Collections.Generic;

namespace API.Model.Tests.Infrastructure {

    public class ValidateEmail : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Email_Case_A();
            yield return Email_Case_B();
            yield return Email_Case_C();
            yield return Email_Case_D();
            yield return Email_Can_Not_Be_Longer_Than_Maximum();
        }

        private static object[] Email_Case_A() {
            return new object[] { "ThisIsNotAnEmail" };
        }

        private static object[] Email_Case_B() {
            return new object[] { "ThisIsNotAnEmail@SomeServer." };
        }

        private static object[] Email_Case_C() {
            return new object[] { "ThisIsNotAnEmail@SomeServer@" };
        }

        private static object[] Email_Case_D() {
            return new object[] { "ThisIsNotAnEmail@SomeServer@.com." };
        }

        private static object[] Email_Can_Not_Be_Longer_Than_Maximum() {
            return new object[] { Helpers.GetLongString() };
        }

    }

}
