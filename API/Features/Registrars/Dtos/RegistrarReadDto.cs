using API.Infrastructure.Classes;

namespace API.Features.Registrars {

    public class RegistrarReadDto {

        public int Id { get; set; }
        public SimpleEntity Ship { get; set; }
        public string Fullname { get; set; }
        public string Phones { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string Address { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}