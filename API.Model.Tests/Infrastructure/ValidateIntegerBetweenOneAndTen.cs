using System.Collections;
using System.Collections.Generic;

namespace API.Model.Tests.Infrastructure {

    public class ValidateIntegerBetweenOneAndTen : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Can_Not_Be_Negative();
            yield return Can_Not_Be_Zero();
            yield return Can_Not_Be_Eleven();
        }

        private static object[] Can_Not_Be_Negative() {
            return new object[] { -1 };
        }

        private static object[] Can_Not_Be_Zero() {
            return new object[] { 0 };
        }

        private static object[] Can_Not_Be_Eleven() {
            return new object[] { 11 };
        }

    }

}
