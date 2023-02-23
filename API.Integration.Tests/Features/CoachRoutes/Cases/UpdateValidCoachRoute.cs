using System.Collections;
using System.Collections.Generic;
using Infrastructure;

namespace CoachRoutes {

    public class UpdateValidRoute : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new TestCoachRoute {
                    Id = 1,
                    PortId = 1,
                    Description = Helpers.CreateRandomString(128),
                    Abbreviation = Helpers.CreateRandomString(10)
                }
            };
        }

    }

}