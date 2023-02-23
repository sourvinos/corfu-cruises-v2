using System;
using System.Collections;
using System.Collections.Generic;

namespace Reservations {

    public class ActiveSimpleUsersCanUpdateOwnedRecordsWhenValid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Simple_Users_Can_Update_Own_Records_When_Valid();
        }

        private static object[] Simple_Users_Can_Update_Own_Records_When_Valid() {
            return new object[] {
                new TestUpdateReservation {
                    ReservationId = Guid.Parse("08da30b7-fdca-4285-8fae-789dc3037124"),
                    Date = "2022-12-04",
                    CustomerId = 2,
                    DestinationId = 1,
                    PickupPointId = 129,
                    ShipId = 6,
                    RefNo = "PA623",
                    TicketNo = "1258",
                    Adults = 3,
                    Kids = 0,
                    Free = 0,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { ReservationId = Guid.Parse("08da30b7-fdca-4285-8fae-789dc3037124"), Id = 3902, Lastname = "KOYRI!", Firstname = "MARILENA", Birthdate = "2022-05-05", NationalityId = 229, GenderId = 2 },
                        new TestPassenger { ReservationId = Guid.Parse("08da30b7-fdca-4285-8fae-789dc3037124"), Id = 3903, Lastname = "KOYRI!", Firstname = "JANE", Birthdate = "2022-05-05", NationalityId = 163, GenderId = 2 },
                        new TestPassenger { ReservationId = Guid.Parse("08da30b7-fdca-4285-8fae-789dc3037124"), Id = 0, Lastname = "NEW", Firstname = "JANE", Birthdate = "2022-05-05", NationalityId = 163, GenderId = 2 }
                    }
                }
            };
        }

    }

}