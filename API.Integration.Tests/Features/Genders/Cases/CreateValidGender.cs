using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace Genders {

    public class CreateValidGender : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestGender {
                    Description = Helpers.CreateRandomString(128)
                }
            };
        }

    }

}
