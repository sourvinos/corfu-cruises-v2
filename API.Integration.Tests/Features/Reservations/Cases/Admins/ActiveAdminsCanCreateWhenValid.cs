using System;
using System.Collections;
using System.Collections.Generic;

namespace Reservations {

    public class ActiveAdminsCanCreateWhenValid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admins_Can_Create_Reservations_For_Past_Date();
            yield return Admins_Can_Create_Reservations_For_Future_Date();
        }

        private static object[] Admins_Can_Create_Reservations_For_Past_Date() {
            return new object[] {
                new TestNewReservation {
                    CustomerId = 1,
                    DestinationId = 1,
                    DriverId = 0,
                    PickupPointId = 642,
                    ShipId = null,
                    Date = "2022-03-04",
                    Now = new DateTime(2022, 3, 5, 12, 00, 00),
                    TicketNo = "xxxx",
                    Adults = 2,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger {
                            Lastname = "AEDAN",
                            Firstname = "ZAYAS",
                            Birthdate = "1992-06-12",
                            NationalityId = 123,
                            GenderId = 1
                        }
                    }
                }
            };
        }

        private static object[] Admins_Can_Create_Reservations_For_Future_Date() {
            return new object[] {
                new TestNewReservation {
                    CustomerId = 1,
                    DestinationId = 1,
                    DriverId = null,
                    PickupPointId = 642,
                    ShipId = 0,
                    Date = "2022-12-04",
                    Now = new DateTime(2022, 3, 5, 12, 00, 00),
                    TicketNo = "xxxx",
                    Adults = 2,
                    Kids = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 123, GenderId = 1 },
                        new TestPassenger { Lastname = "ALONA", Firstname = "CUTLER", Birthdate = "1964-04-28", NationalityId = 127, GenderId = 2 },
                        new TestPassenger { Lastname = "LYA", Firstname = "TROWBRIDGE", Birthdate = "2015-01-21", NationalityId = 211, GenderId = 1 },
                    }
                }
            };
        }

    }

}
