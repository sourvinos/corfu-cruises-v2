using System.Collections;
using System.Collections.Generic;

namespace API.Model.Tests.Infrastructure {

    public class ValidateIntegerBetweenZeroAndOneThousand : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Can_Not_Be_Negative();
            yield return Can_Not_Be_One_Thousand_One();
        }

        private static object[] Can_Not_Be_Negative() {
            return new object[] { -1 };
        }

        private static object[] Can_Not_Be_One_Thousand_One() {
            return new object[] { 1001 };
        }

    }

}
