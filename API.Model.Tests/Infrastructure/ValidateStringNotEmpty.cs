using System.Collections;
using System.Collections.Generic;

namespace API.Model.Tests.Infrastructure {

    public class ValidateStringNotEmpty : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Can_Not_Be_Null();
            yield return Can_Not_Be_Empty();
        }

        private static object[] Can_Not_Be_Null() {
            return new object[] { null };
        }

        private static object[] Can_Not_Be_Empty() {
            return new object[] { string.Empty };
        }

    }

}
