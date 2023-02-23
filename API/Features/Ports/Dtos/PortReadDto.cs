namespace API.Features.Ports {

    public class PortReadDto {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public int StopOrder { get; set; }
        public bool IsActive { get; set; }

    }

}