using System.Collections;
using System.Collections.Generic;

namespace API.Model.Tests.Infrastructure {

    public class ValidateTime : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Time_Can_Not_Be_Invalid();
            yield return Time_Can_Not_Be_Hour_Short();
            yield return Time_Can_Not_Be_Minute_Short();
        }

        private static object[] Time_Can_Not_Be_Invalid() {
            return new object[] { "41:45" };
        }

        private static object[] Time_Can_Not_Be_Hour_Short() {
            return new object[] { "1:45" };
        }

        private static object[] Time_Can_Not_Be_Minute_Short() {
            return new object[] { "01:5" };
        }

    }

}
