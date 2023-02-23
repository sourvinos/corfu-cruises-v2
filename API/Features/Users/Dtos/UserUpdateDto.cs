namespace API.Features.Users {

    public class UserUpdateDto : IUser {

        public string Id { get; set; }
        public string Username { get; set; }
        public string Displayname { get; set; }
        public int? CustomerId { get; set; }
        public string Email { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsActive { get; set; }

    }

}