using API.Infrastructure.Account;
using Microsoft.Extensions.Options;
using MimeKit;

namespace API.Features.CheckIn {

    public class CheckInEmailSender : ICheckInEmailSender {

        private readonly EmailSettings settings;

        public CheckInEmailSender(IOptions<EmailSettings> settings) {
            this.settings = settings.Value;
        }

        public SendEmailResponse SendEmail(CheckInEmailVM email) {

            var message = new MimeMessage();
            var htmlContent = "";

            htmlContent += email.RefNo;

            message.From.Add(new MailboxAddress(settings.From, settings.UserName));
            message.To.Add(new MailboxAddress("Guest", email.Email));
            message.Subject = "";
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

    }

}