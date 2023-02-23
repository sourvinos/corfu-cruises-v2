using System;
using System.Collections;
using System.Collections.Generic;

namespace Reservations {

    public class ActiveSimpleUsersCanNotUpdate : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_Not_Update_Not_Owned_Reservations();
            yield return Simple_Users_Can_Not_Update_Owned_Reservations_After_Departure();
        }

        private static object[] Simple_Users_Can_Not_Update_Not_Owned_Reservations() {
            return new object[] {
                new TestUpdateReservation {
                    StatusCode = 490,
                    ReservationId = Guid.Parse("08da1f85-42c0-4777-8fe5-3ab3a814fa66"),
                    Date = "2022-03-02",
                    CustomerId = 2,
                    DestinationId = 1,
                    PickupPointId = 347,
                    RefNo = "PA7",
                    TicketNo = "654",
                    Adults = 2
                }
            };
        }

        private static object[] Simple_Users_Can_Not_Update_Owned_Reservations_After_Departure() {
            return new object[] {
                new TestUpdateReservation {
                    StatusCode = 431,
                    ReservationId = Guid.Parse("08da2694-67a3-416c-8f05-d8aa777c7c1a"),
                    Date = "2022-03-02",
                    Now = new DateTime(2022, 3, 2, 11, 30, 00),
                    CustomerId = 2,
                    DestinationId = 1,
                    PickupPointId = 248,
                    RefNo = "PA50",
                    TicketNo = "#11",
                    Adults = 2
               }
            };
        }

    }

}