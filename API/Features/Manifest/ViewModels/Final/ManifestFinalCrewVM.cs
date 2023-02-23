using API.Infrastructure.Classes;

namespace API.Features.Manifest {

    public class ManifestFinalCrewVM {

        public int Id { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public string Remarks { get; set; }
        public string SpecialCare { get; set; }
        public SimpleEntity Gender { get; set; }
        public ManifestFinalNationalityVM Nationality { get; set; }
        public SimpleEntity Occupant { get; set; }

    }

}