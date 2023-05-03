using System;
using System.Collections;
using System.Collections.Generic;

namespace Reservations {

    public class ActiveSimpleUsersCanCreateWhenValid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_Create_Records_For_Future_Date();
            yield return Simple_Users_Can_Create_Records_WithOut_Transfer_For_Next_Day_Between_Closing_Time_And_Midnight();
            yield return Simple_Users_Can_Create_Records_WithOut_Transfer_For_Next_Day_Between_Midnight_And_Departure();
        }

        private static object[] Simple_Users_Can_Create_Records_For_Future_Date() {
            return new object[] {
                new TestNewReservation {
                    CustomerId = 2,
                    DestinationId = 1,
                    PickupPointId = 12,
                    Date = "2022-09-15",
                    Now = new DateTime(2022, 09, 14, 12, 0, 0),
                    TicketNo = "xxxx",
                    Adults = 3,
                    Passengers = new List<TestPassenger>()
                }
            };
        }

        private static object[] Simple_Users_Can_Create_Records_WithOut_Transfer_For_Next_Day_Between_Closing_Time_And_Midnight() {
            return new object[] {
                new TestNewReservation {
                    Date = "2022-09-15",
                    Now = new DateTime(2022, 09, 14, 23, 30, 0),
                    CustomerId = 2,
                    DestinationId = 1,
                    DriverId = 0,
                    PickupPointId = 507,
                    ShipId = null,
                    TicketNo = "xxxx",
                    Adults = 3,
                    Passengers = new List<TestPassenger>()
                }
            };
        }

        private static object[] Simple_Users_Can_Create_Records_WithOut_Transfer_For_Next_Day_Between_Midnight_And_Departure() {
            return new object[] {
                new TestNewReservation {
                    Date = "2022-09-15",
                    Now = new DateTime(2022, 09, 14, 04, 45, 0),
                    CustomerId = 2,
                    DestinationId = 1,
                    DriverId = 0,
                    PickupPointId = 507,
                    ShipId = null,
                    TicketNo = "xxxx",
                    Adults = 3,
                    Passengers = new List<TestPassenger>()
                }
            };
        }

    }

}
