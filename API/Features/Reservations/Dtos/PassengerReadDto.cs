using API.Infrastructure.Classes;
using System;

namespace API.Features.Reservations {

    public class PassengerReadDto {

        public int Id { get; set; }

        public Guid ReservationId { get; set; }

        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public string Remarks { get; set; }
        public string SpecialCare { get; set; }
        public bool IsCheckedIn { get; set; }

        public NationalityDto Nationality { get; set; }
        public SimpleEntity Gender { get; set; }

    }

    public class NationalityDto : SimpleEntity {
        
        public string Code { get; set; }

    }

}