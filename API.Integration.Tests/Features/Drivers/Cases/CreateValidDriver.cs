using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace Drivers {

    public class CreateValidDriver : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestDriver {
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
