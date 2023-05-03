using System;
using System.Collections;
using System.Collections.Generic;

namespace Reservations {

    public class ActiveAdminsCanNotUpdateWhenInvalid : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Duplicate_Records_Are_Not_Allowed();
            yield return Nothing_For_This_Day();
            yield return Nothing_For_This_Day_And_Destination();
            yield return Nothing_For_This_Day_And_Destination_And_Port();
            yield return Passenger_Count_Is_Not_Correct();
            yield return Customer_Must_Exist();
            yield return Destination_Must_Exist();
            yield return Driver_Must_Exist();
            yield return Gender_Must_Exist();
            yield return Nationality_Must_Exist();
            yield return PickupPoint_Must_Exist();
            yield return Ship_Must_Exist();
        }

        private static object[] Nothing_For_This_Day() {
            return new object[] {
                new TestUpdateReservation {
                    StatusCode = 410,
                    ReservationId = Guid.Parse("08da3262-6a70-4d76-88ca-3af058930134"),
                    CustomerId = 38,
                    DestinationId = 1,
                    DriverId = null,
                    PickupPointId = 133,
                    ShipId = null,
                    Date = "2022-01-01",
                    RefNo = "PA776",
                    TicketNo = "D5",
                    Adults = 2,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "TIMMINS", Firstname = "JOAN", Birthdate = "2065-08-21", NationalityId = 70, GenderId = 2 },
                        new TestPassenger { Lastname = "TIMMINS", Firstname = "ALAN", Birthdate = "2065-07-17", NationalityId = 70, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Nothing_For_This_Day_And_Destination() {
            return new object[] {
                new TestUpdateReservation {
                    StatusCode = 410,
                    ReservationId = Guid.Parse("08da3262-6a70-4d76-88ca-3af058930134"),
                    CustomerId = 38,
                    DestinationId = 3,
                    DriverId = null,
                    PickupPointId = 133,
                    ShipId = null,
                    Date = "2022-05-01",
                    RefNo = "PA776",
                    TicketNo = "D5",
                    Adults = 2,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "TIMMINS", Firstname = "JOAN", Birthdate = "2065-08-21", NationalityId = 70, GenderId = 2 },
                        new TestPassenger { Lastname = "TIMMINS", Firstname = "ALAN", Birthdate = "2065-07-17", NationalityId = 70, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Nothing_For_This_Day_And_Destination_And_Port() {
            return new object[] {
                new TestUpdateReservation {
                    StatusCode = 410,
                    ReservationId = Guid.Parse("08da1f85-2fec-4911-8580-4cc7adba706f"),
                    CustomerId = 12,
                    DestinationId = 1,
                    DriverId = null,
                    PickupPointId = 266,
                    ShipId = 6,
                    Date = "2022-03-01",
                    RefNo = "PRT507",
                    TicketNo = "Eagle Travel",
                    Adults = 5,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "sacomono", Firstname = "MARIECLEO", Birthdate = "1981-08-14", NationalityId = 89, GenderId = 2 },
                        new TestPassenger { Lastname = "KAGREN", Firstname = "BIRCH", Birthdate = "1957-12-13", NationalityId = 89, GenderId = 2 },
                        new TestPassenger { Lastname = "ANDREW", Firstname = "SUZAN", Birthdate = "1975-08-21", NationalityId = 89, GenderId = 2 },
                        new TestPassenger { Lastname = "ADEONOJOBI", Firstname = "PETER", Birthdate = "1965-11-11", NationalityId = 89, GenderId = 1 },
                        new TestPassenger { Lastname = "DERBY ", Firstname = "ELAINE", Birthdate = "1964-12-12", NationalityId = 89, GenderId = 2 }
                    }
                }
            };
        }

        private static object[] Duplicate_Records_Are_Not_Allowed() {
            return new object[] {
                new TestUpdateReservation {
                    StatusCode = 409,
                    ReservationId = Guid.Parse("08da2863-15d9-4338-81fa-637a52371163"),
                    Date = "2022-05-01",
                    CustomerId = 2,
                    DestinationId = 1,
                    PickupPointId = 266,
                    TicketNo = "23"
                }
            };
        }

        private static object[] Passenger_Count_Is_Not_Correct() {
            return new object[]{
                new TestUpdateReservation{
                    StatusCode = 455,
                    ReservationId = Guid.Parse("08da2863-15d9-4338-81fa-637a52371163"),
                    CustomerId = 2,
                    DestinationId = 1,
                    PickupPointId = 248,
                    Date = "2022-05-01",
                    TicketNo = "21",
                    Adults = 2,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "AEDAN", Firstname = "ZAYAS", Birthdate = "1992-06-12", NationalityId = 123, GenderId = 1 },
                        new TestPassenger { Lastname = "ALONA", Firstname = "CUTLER", Birthdate = "1964-04-28", NationalityId = 127, GenderId = 2 },
                        new TestPassenger { Lastname = "LYA", Firstname = "TROWBRIDGE", Birthdate = "2015-01-21", NationalityId = 211, GenderId = 1 },
                    }
                }
            };
        }

        private static object[] Customer_Must_Exist() {
            return new object[] {
                new TestUpdateReservation {
                    StatusCode = 450,
                    ReservationId = Guid.Parse("08da2863-15d9-4338-81fa-637a52371163"),
                    CustomerId = 999,
                    DestinationId = 1,
                    DriverId = 18,
                    PickupPointId = 248,
                    ShipId = 6,
                    Date = "2022-05-01",
                    RefNo = "PA175",
                    TicketNo = "21",
                    Adults = 3,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "VOYER", Firstname = "ALESCANDRA", Birthdate = "1991-06-05", NationalityId = 233, GenderId = 2 },
                        new TestPassenger { Lastname = "VOYER", Firstname = "ANNIE", Birthdate = "1962-12-25", NationalityId = 233, GenderId = 2 },
                        new TestPassenger { Lastname = "VOYER", Firstname = "NATHAN", Birthdate = "2018-02-05", NationalityId = 233, GenderId = 1 }
                    }
                }
            };
        }

        private static object[] Destination_Must_Exist() {
            return new object[] {
                new TestUpdateReservation {
                    StatusCode = 451,
                    ReservationId = Guid.Parse("08da2863-15d9-4338-81fa-637a52371163"),
                    CustomerId = 2,
                    DestinationId = 99,
                    DriverId = 18,
                    PickupPointId = 248,
                    ShipId = 6,
                    Date = "2022-05-01",
                    RefNo = "PA175",
                    TicketNo = "21",
                    Adults = 2
                }
            };
        }

        private static object[] Driver_Must_Exist() {
            return new object[] {
                new TestUpdateReservation {
                    StatusCode = 453,
                    ReservationId = Guid.Parse("08da2863-15d9-4338-81fa-637a52371163"),
                    CustomerId = 2,
                    DestinationId = 1,
                    DriverId = 99,
                    PickupPointId = 248,
                    ShipId = 6,
                    Date = "2022-05-01",
                    TicketNo = "21",
                    Adults = 2
                }
            };
        }

        private static object[] Gender_Must_Exist() {
            return new object[] {
                new TestUpdateReservation {
                    StatusCode = 457,
                    ReservationId = Guid.Parse("08da2863-15d9-4338-81fa-637a52371163"),
                    CustomerId = 2,
                    DestinationId = 1,
                    DriverId = 18,
                    PickupPointId = 248,
                    ShipId = 6,
                    Date = "2022-05-01",
                    TicketNo = "21",
                    Adults = 2,
                    Free = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "VOYER", Firstname = "ALESCANDRA", Birthdate = "1991-06-05", NationalityId = 233, GenderId = 99 },
                        new TestPassenger { Lastname = "VOYER", Firstname = "ANNIE", Birthdate = "1962-12-25", NationalityId = 233, GenderId = 99 },
                        new TestPassenger { Lastname = "VOYER", Firstname = "NATHAN", Birthdate = "2018-02-05", NationalityId = 233, GenderId = 99 }
                    }
                }
            };
        }

        private static object[] Nationality_Must_Exist() {
            return new object[]{
                new TestUpdateReservation{
                    StatusCode = 456,
                    ReservationId = Guid.Parse("08da2863-15d9-4338-81fa-637a52371163"),
                    CustomerId = 2,
                    DestinationId = 1,
                    DriverId = 18,
                    PickupPointId = 248,
                    ShipId = 6,
                    Date = "2022-05-01",
                    TicketNo = "21",
                    Adults = 2,
                    Free = 1,
                    Passengers = new List<TestPassenger>() {
                        new TestPassenger { Lastname = "VOYER", Firstname = "ALESCANDRA", Birthdate = "1991-06-05", NationalityId = 999, GenderId = 2 },
                        new TestPassenger { Lastname = "VOYER", Firstname = "ANNIE", Birthdate = "1962-12-25", NationalityId = 999, GenderId = 2 },
                        new TestPassenger { Lastname = "VOYER", Firstname = "NATHAN", Birthdate = "2018-02-05", NationalityId = 999, GenderId = 1 }
                    }
                }
            };
        }

        private static object[] PickupPoint_Must_Exist() {
            return new object[] {
                new TestUpdateReservation{
                    StatusCode = 452,
                    ReservationId = Guid.Parse("08da2863-15d9-4338-81fa-637a52371163"),
                    CustomerId = 2,
                    DestinationId = 1,
                    DriverId = 18,
                    PickupPointId = 999,
                    ShipId = 6,
                    Date = "2022-05-01",
                    TicketNo = "21",
                    RefNo = "PA175",
                    Adults = 2,
                    Free = 1
                }
            };
        }

        private static object[] Ship_Must_Exist() {
            return new object[] {
                new TestUpdateReservation{
                    StatusCode = 454,
                    ReservationId = Guid.Parse("08da2863-15d9-4338-81fa-637a52371163"),
                    CustomerId = 2,
                    DestinationId = 1,
                    DriverId = 18,
                    PickupPointId = 248,
                    ShipId = 99,
                    Date = "2022-05-01",
                    TicketNo = "21",
                    Adults = 2,
                    Free = 1
            }};
        }

    }

}
