using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace Destinations {

    public class UpdateInvalidDestination : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return NotFound();
        }

        private static object[] NotFound() {
            return new object[] {
                new TestDestination {
                    Id = 9999,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation = Helpers.CreateRandomString(5)
                }
            };
        }

    }

}
