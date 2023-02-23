using System.Collections;
using System.Collections.Generic;

namespace Schedules {

    public class CreateInvalidSchedule : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return All_Destinations_Must_Exist();
            yield return All_Destinations_Must_Be_Active();
            yield return All_Ports_Must_Exist();
            yield return All_Ports_Must_Be_Active();
        }

        private static object[] All_Destinations_Must_Exist() {
            return new object[] {
                new NewTestSchedule {
                    StatusCode = 451,
                    TestScheduleBody = new List<TestScheduleBody>() {
                        new TestScheduleBody {
                            DestinationId = 1, // Exists
                            PortId = 1,
                            Date = "2022-02-01",
                            DepartureTime = "08:00",
                            MaxPax = 185
                        },
                        new TestScheduleBody {
                            DestinationId = 2, // Does not exist
                            PortId = 1,
                            Date = "2021-10-02",
                            DepartureTime = "08:00",
                            MaxPax = 185
                        }
                    }
                }
            };
        }

        private static object[] All_Destinations_Must_Be_Active() {
            return new object[] {
                new NewTestSchedule {
                    StatusCode = 451,
                    TestScheduleBody = new List<TestScheduleBody>() {
                        new TestScheduleBody {
                            DestinationId = 6, // Is not active
                            PortId = 1,
                            Date = "2022-02-01",
                            DepartureTime = "08:00",
                            MaxPax = 185
                        },
                        new TestScheduleBody {
                            DestinationId = 1, // Is active
                            PortId = 1,
                            Date = "2021-10-02",
                            DepartureTime = "08:00",
                            MaxPax = 185
                        }
                    }
                }
            };
        }

        private static object[] All_Ports_Must_Exist() {
            return new object[] {
                new NewTestSchedule {
                    StatusCode = 411,
                    TestScheduleBody = new List<TestScheduleBody>() {
                        new TestScheduleBody {
                            DestinationId = 1,
                            PortId = 3, // Does not exist
                            Date = "2022-02-01",
                            DepartureTime = "08:00",
                            MaxPax = 185
                        },
                        new TestScheduleBody {
                            DestinationId = 1,
                            PortId = 1, // Exists
                            Date = "2021-10-02",
                            DepartureTime = "08:00",
                            MaxPax = 185
                        }
                    }
                }
            };
        }

        private static object[] All_Ports_Must_Be_Active() {
            return new object[] {
                new NewTestSchedule {
                    StatusCode = 411,
                    TestScheduleBody = new List<TestScheduleBody>() {
                        new TestScheduleBody {
                            DestinationId = 1,
                            PortId = 1, // Is active
                            Date = "2022-02-01",
                            DepartureTime = "08:00",
                            MaxPax = 185
                        },
                        new TestScheduleBody {
                            DestinationId = 1,
                            PortId = 17, // Not active
                            DepartureTime = "08:00",
                            Date = "2021-10-02",
                            MaxPax = 185
                        }
                    }
                }
            };
        }


    }

}