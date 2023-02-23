using API.Infrastructure.Classes;

namespace API.Features.Registrars {

    public class RegistrarListVM {

        public int Id { get; set; }
        public SimpleEntity Ship { get; set; }
        public string Fullname { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }

    }

}