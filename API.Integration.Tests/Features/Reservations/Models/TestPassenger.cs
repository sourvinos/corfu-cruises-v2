using System;

namespace Reservations {

    public class TestPassenger {

        public int Id { get; set; }
        public Guid ReservationId { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public int NationalityId { get; set; }
        public int GenderId { get; set; }

    }

}