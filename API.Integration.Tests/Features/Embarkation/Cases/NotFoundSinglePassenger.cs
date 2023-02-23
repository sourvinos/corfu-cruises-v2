using System.Collections;
using System.Collections.Generic;

namespace Embarkation {

    public class NotFoundSinglePassenger : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return InvalidRecord();
        }

        private static object[] InvalidRecord() {
            return new object[] {
                new TestPassenger {
                    Id = 1
                }
            };
        }

    }

}
