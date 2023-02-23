namespace API.Infrastructure.Account {

    public interface IEmailSender {

        SendEmailResponse SendLoginCredentials(LoginCredentialsVM model, string loginLink);

        SendEmailResponse SendResetPasswordEmail(string displayName, string userEmail, string callbackUrl, string language);

    }

}