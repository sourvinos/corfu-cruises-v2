using System.Collections;
using System.Collections.Generic;

namespace Schedules {

    public class CreateValidSchedule : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return ValidRecord();
        }

        private static object[] ValidRecord() {
            return new object[] {
                new NewTestSchedule {
                    TestScheduleBody = new List<TestScheduleBody>() {
                        new TestScheduleBody {
                            DestinationId = 1,
                            PortId = 1,
                            Date = "2022-02-01",
                            DepartureTime = "08:00",
                            MaxPax = 0
                        },
                        new TestScheduleBody {
                            DestinationId = 1,
                            PortId = 1,
                            Date = "2021-10-02",
                            DepartureTime = "08:00",
                            MaxPax = 185
                        }
                    }
                }
            };
        }

    }

}