using System;
using System.Collections;
using System.Collections.Generic;

namespace Reservations {

    public class ActiveAdminsCanDeleteOwnedByAnyone : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return Admins_Can_Delete_Own_Records();
            yield return Admins_Can_Delete_Records_Owned_By_Other_Admins();
            yield return Admins_Can_Delete_Records_Owned_By_Simple_Users();
        }

        private static object[] Admins_Can_Delete_Own_Records() {
            return new object[] {
                new TestNewReservation {
                    ReservationId = Guid.Parse("08da1dc9-17fa-4a11-8177-afa0c6ce06ea")
                }
            };
        }

        private static object[] Admins_Can_Delete_Records_Owned_By_Other_Admins() {
            return new object[] {
                new TestNewReservation {
                    ReservationId = Guid.Parse("08da276d-5e6a-40a5-83cf-5e7f6762f28f")
                }
            };
        }

        private static object[] Admins_Can_Delete_Records_Owned_By_Simple_Users() {
            return new object[] {
                new TestNewReservation {
                    ReservationId = Guid.Parse("08da22a5-4424-41ab-8bbf-0026535e0920")
                }
            };
        }

    }

}