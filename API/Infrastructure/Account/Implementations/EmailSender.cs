using System;
using Microsoft.Extensions.Options;
using MimeKit;

namespace API.Infrastructure.Account {

    public class EmailSender : IEmailSender {

        private readonly EmailSettings settings;

        public EmailSender(IOptions<EmailSettings> settings) {
            this.settings = settings.Value;
        }

        public SendEmailResponse SendLoginCredentials(LoginCredentialsVM model, string loginLink) {

            var message = new MimeMessage();

            var htmlContent = "";
            var body = EmailMessages.FirstLoginCredentials(model.Language);

            htmlContent += "<h1 style = 'font-weight: 500;'><span style = 'color: #0078d7;'>Corfu</span><span style = 'color: #5db2ff;'> Cruises</span></h1>";
            htmlContent += "<p>" + body[0] + model.Displayname + "!</p>";
            htmlContent += "<p>" + body[1] + "</p>";
            htmlContent += "<p>" + body[2] + model.UserName + "</p>";
            htmlContent += "<p>" + body[3] + model.Password + "</p>";
            htmlContent += "<br>";
            htmlContent += "<a style = 'font-variant: petite-caps; color: #ffffff; margin: 1rem; background-color: #55828B; padding: 1rem; border-radius: 5px; text-decoration: none;' href=" + loginLink + ">" + body[7] + "</a>";
            htmlContent += "<br>";
            htmlContent += "<br>";
            htmlContent += "<p style = 'color: #ff0000;'>" + body[4] + "</p>";
            htmlContent += "<p style = 'color: #ff0000;'>" + body[5] + "</p>";
            htmlContent += "<p style = 'color: #ff0000;'>" + body[6] + "</p>";
            htmlContent += "<br>";
            htmlContent += "<p>" + body[8] + "</p>";
            htmlContent += "<br>";
            htmlContent += "<p>" + body[9] + "</p>";
            htmlContent += "<p>Corfu Cruises " + DateTime.Now.ToString("yyyy") + "</p>";

            message.From.Add(new MailboxAddress(settings.From, settings.UserName));
            message.To.Add(new MailboxAddress(model.Displayname, model.Email));
            message.Subject = body[10];
            message.Body = new TextPart("html") {
                Text = htmlContent
            };

            using (var client = new MailKit.Net.Smtp.SmtpClient()) {
                client.Connect(settings.SmtpClient, settings.Port, false);
                client.Authenticate(settings.UserName, settings.Password);
                client.Send(message);
                client.Disconnect(true);
            }

            return new SendEmailResponse();

        }

        public SendEmailResponse SendResetPasswordEmail(string displayName, string userEmail, string callbackUrl, string language) {
            try {
                var message = new MimeMessage();
                var builder = new BodyBuilder { HtmlBody = UpdateResetPasswordWithVariables(displayName, callbackUrl) };
                message.Body = builder.ToMessageBody();
                message.From.Add(new MailboxAddress(settings.From, settings.UserName));
                message.To.Add(new MailboxAddress(displayName, userEmail));
                message.Subject = "Your request for new password";
                using (var client = new MailKit.Net.Smtp.SmtpClient()) {
                    client.Connect(settings.SmtpClient, settings.Port, false);
                    client.Authenticate(settings.UserName, settings.Password);
                    client.Send(message);
                    client.Disconnect(true);
                }
                return new SendEmailResponse();
            } catch (Exception exception) {
                return new SendEmailResponse { ErrorMsg = exception.Message };
            }
        }

        private static string UpdateResetPasswordWithVariables(string displayName, string callbackUrl) {
            var response = ResetPasswordTemplate.GetHtmlString();
            var updatedResponse = response
                .Replace("[displayName]", displayName)
                .Replace("[callbackUrl]", callbackUrl);
            return updatedResponse;
        }

    }

}