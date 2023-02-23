using System.Collections;
using System.Collections.Generic;

namespace Schedules {

    public class UpdateInvalidSchedule : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Destination_Must_Exist();
            yield return Port_Must_Exist();
        }

        private static object[] Destination_Must_Exist() {
            return new object[] {
                new UpdateTestSchedule {
                    StatusCode = 451,
                    Id = 677,
                    DestinationId = 99,
                    PortId = 2,
                    Date = "2022-12-04",
                    DepartureTime = "08:00",
                    MaxPax = 185
                }
            };
        }

        private static object[] Port_Must_Exist() {
            return new object[] {
                new UpdateTestSchedule {
                    StatusCode = 411,
                    Id = 677,
                    DestinationId = 1,
                    PortId = 99,
                    Date = "2022-12-04",
                    DepartureTime = "08:00",
                    MaxPax = 185
                },
            };
        }

    }

}