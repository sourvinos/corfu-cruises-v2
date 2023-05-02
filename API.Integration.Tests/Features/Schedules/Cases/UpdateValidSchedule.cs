using System.Collections;
using System.Collections.Generic;

namespace Schedules {

    public class UpdateValidSchedule : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new UpdateTestSchedule {
                    StatusCode = 200,
                    Id = 677,
                    DestinationId = 1,
                    PortId = 1,
                    Date = "2022-12-04",
                    Time = "08:00",
                    MaxPax = 185
                }
            };
        }

    }

}