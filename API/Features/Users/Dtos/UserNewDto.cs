namespace API.Features.Users {

    public class UserNewDto : IUser {

        public string Username { get; set; }
        public string Displayname { get; set; }
        public int? CustomerId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsActive { get; set; }
    }

}