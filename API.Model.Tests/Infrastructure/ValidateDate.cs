using System.Collections;
using System.Collections.Generic;

namespace API.Model.Tests.Infrastructure {

    public class ValidateDate : IEnumerable<object[]> {

        // Valid format is YYYY-MM-DD

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Date_Can_Not_Be_Null();
            yield return Date_Can_Not_Be_Empty();
            yield return Date_Can_Not_Be_In_Format_A();
            yield return Date_Can_Not_Be_In_Format_B();
            yield return Date_Can_Not_Be_In_Format_C();
            yield return Date_Can_Not_Be_In_Format_D();
            yield return Date_Can_Not_Be_In_Format_E();
        }

        private static object[] Date_Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] Date_Can_Not_Be_Empty() {
            return new object[] { string.Empty };
        }

        private static object[] Date_Can_Not_Be_In_Format_A() {
            return new object[] { "01-01-2020" };
        }

        private static object[] Date_Can_Not_Be_In_Format_B() {
            return new object[] { "14/08/2020" };
        }

        private static object[] Date_Can_Not_Be_In_Format_C() {
            return new object[] { "12-01-2020" };
        }

        private static object[] Date_Can_Not_Be_In_Format_D() {
            return new object[] { "2020/13/01" };
        }

        private static object[] Date_Can_Not_Be_In_Format_E() {
            return new object[] { "2020-13-01" };
        }

    }

}
