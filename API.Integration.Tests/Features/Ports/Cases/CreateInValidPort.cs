using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace Ports {

    public class CreateInvalidPort : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return StopOrderNotUnique();
        }

        private static object[] StopOrderNotUnique() {
            return new object[] {
                new TestPort {
                    StatusCode = 493,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation= Helpers.CreateRandomString(5),
                    StopOrder = 2
                }
            };
        }

    }

}
