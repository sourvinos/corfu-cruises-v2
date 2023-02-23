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
            yield return Admins_Can_Update_Records_With_Inactive_Customer();
            yield return Admins_Can_Update_Records_With_Inactive_Destination();
            yield return Admins_Can_Update_Records_With_Inactive_Driver();
            yield return Admins_Can_Update_Records_With_Inactive_PickupPoint();
            yield return Admins_Can_Update_Records_With_Inactive_Ship();
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

        private static object[] Admins_Can_Update_Records_With_Inactive_Customer() {
            return new object[] {
                new TestUpdateReservation {
                    ReservationId = Guid.Parse("08da28ff-841c-4717-8085-172e4893f79d"),
                    Date = "2022-05-01",
                    CustomerId = 63,
                    DestinationId = 1,
                    PickupPointId = 507,
                    TicketNo = "1"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_Destination() {
            return new object[] {
                new TestUpdateReservation {
                    ReservationId = Guid.Parse("08da2b39-151d-4e9d-8739-08229766ead5"),
                    Date = "2022-07-16",
                    CustomerId = 12,
                    DestinationId = 6,
                    PickupPointId = 510,
                    TicketNo = "Rep"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_Driver() {
            return new object[] {
                new TestUpdateReservation {
                    ReservationId = Guid.Parse("08da22d0-dc9f-4e24-8a1c-6f9af6eac1f3"),
                    Date = "2022-03-02",
                    CustomerId = 44,
                    DestinationId = 1,
                    DriverId = 3,
                    PickupPointId = 493,
                    TicketNo = "258"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_PickupPoint() {
            return new object[] {
                new TestUpdateReservation {
                    ReservationId = Guid.Parse("08da2a9a-8dbe-4e40-8e39-24f8ff06c14a"),
                    Date = "2022-05-01",
                    CustomerId = 6,
                    DestinationId = 1,
                    DriverId = 18,
                    PickupPointId = 520,
                    TicketNo = "CFU 220263"
                }
            };
        }

        private static object[] Admins_Can_Update_Records_With_Inactive_Ship() {
            return new object[] {
                new TestUpdateReservation {
                    ReservationId = Guid.Parse("08da2ac4-f4d6-4b30-86e0-5016f398536a"),
                    Date = "2022-05-01",
                    CustomerId = 46,
                    DestinationId = 1,
                    DriverId = 18,
                    PickupPointId = 162,
                    ShipId = 8,
                    TicketNo = "SVAMI"
                }
            };
        }

    }

}