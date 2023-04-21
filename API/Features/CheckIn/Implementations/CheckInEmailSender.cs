using API.Infrastructure.Account;
using Microsoft.Extensions.Options;
using MimeKit;

namespace API.Features.CheckIn {

    public class CheckInEmailSender : ICheckInEmailSender {

        private readonly EmailSettings settings;

        public CheckInEmailSender(IOptions<EmailSettings> settings) {
            this.settings = settings.Value;
        }

        public SendEmailResponse SendEmail(CheckInReservationVM reservation) {

            var message = new MimeMessage();
            var htmlContent = "";

            htmlContent += "<h1 style = 'font-weight: 500;'><span style = 'color: #0078d7;'>" + reservation.RefNo + "</span></h1>";

            message.From.Add(new MailboxAddress(settings.From, settings.UserName));
            message.To.Add(new MailboxAddress("Guest", reservation.Email));
            message.Subject = "Your Reservation Details";
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