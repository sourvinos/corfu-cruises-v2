namespace API.Infrastructure.Account {

    public class ChangePasswordVM {

        public string UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }

    }

}