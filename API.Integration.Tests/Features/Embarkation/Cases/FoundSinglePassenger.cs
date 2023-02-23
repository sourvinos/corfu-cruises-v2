using System.Collections;
using System.Collections.Generic;

namespace Embarkation {

    public class FoundSinglePassenger : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestPassenger {
                    Id = 903
                }
            };
        }

    }

}
