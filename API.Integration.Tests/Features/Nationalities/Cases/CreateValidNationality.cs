using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace Nationalities {

    public class CreateValidNationality : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestNationality {
                    Description = Helpers.CreateRandomString(128),
                    Code = Helpers.CreateRandomString(10)
                }
            };
        }

    }

}
