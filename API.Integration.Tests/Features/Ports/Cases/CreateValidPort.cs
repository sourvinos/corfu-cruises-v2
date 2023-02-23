using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace Ports {

    public class CreateValidPort : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestPort {
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation= Helpers.CreateRandomString(5),
                    StopOrder = 6
                }
            };
        }

    }

}
