using System;
using System.Collections;
using System.Collections.Generic;

namespace Reservations {

    public class ActiveAdminsCanUpdateWhenValid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admins_Can_Update_Own_Records();
            yield return Admins_Can_Update_Records_Owned_By_Other_Admins();
            yield return Admins_Can_Update_Records_Owned_By_Simple_Users();
        }

        private static object[] Admins_Can_Update_Own_Records() {
            return new object[] {
                new TestUpdateReservation {
                    ReservationId = Guid.Parse("08da2863-15d9-4338-81fa-637a52371163"),
                    Date = "2022-05-01",
                    CustomerId = 2,
                    DestinationId = 1,
                    PickupPointId = 248,
                    RefNo = "PA175",
                    TicketNo = "21",
                    Adults = 2
                }
            };
        }

        private static object[] Admins_Can_Update_Records_Owned_By_Other_Admins() {
            return new object[] {
                new TestUpdateReservation {
                    ReservationId = Guid.Parse("08da2865-d8c0-40de-815c-eba6f09db081"),
                    Date = "2022-05-01",
                    CustomerId = 2,
                    DestinationId = 1,
                    PickupPointId = 266,
                    TicketNo = "23"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_Owned_By_Simple_Users() {
            return new object[] {
                new TestUpdateReservation {
                    ReservationId = Guid.Parse("08da30b7-fdca-4285-8fae-789dc3037124"),
                    Date = "2022-12-04",
                    CustomerId = 2,
                    DestinationId = 1,
                    PickupPointId = 129,
                    TicketNo = "1258"
                }
            };
        }

    }

}