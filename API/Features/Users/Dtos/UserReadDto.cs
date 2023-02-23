using API.Infrastructure.Classes;

namespace API.Features.Users {

    public class UserReadDto {

        public string Id { get; set; }
        public string UserName { get; set; }
        public string Displayname { get; set; }
        public SimpleEntity Customer { get; set; }
        public string Email { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsActive { get; set; }

    }

}