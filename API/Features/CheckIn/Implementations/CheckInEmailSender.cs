using API.Infrastructure.Account;
using API.Infrastructure.Helpers;
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

            htmlContent += "<div id='details'>";
            htmlContent += "    <div style='padding: 0.5rem;'>";
            htmlContent += "        <span style='color: darkblue; font-family: 'Asty CF Std'; font-size: 10px; font-weight: 300;'>RefNo: </span>";
            htmlContent += "        <span style='color: #115abb; font-family: 'Asty CF Std'; font-size: 10px; font-weight: 300;'>" + reservation.RefNo + "</span>";
            htmlContent += "    </div>";
            htmlContent += "    <div style='padding: 0.5rem;'>";
            htmlContent += "        <span style='color: darkblue; font-family: 'Asty CF Std'; font-size: 10px; font-weight: 300;'>Date: </span>";
            htmlContent += "        <span style='color: #115abb; font-family: 'Asty CF Std'; font-size: 10px; font-weight: 300;'>" + DateHelpers.FormatDateStringToLocaleString(reservation.Date) + "</span>";
            htmlContent += "    </div>";
            htmlContent += "    <div style='padding: 0.5rem;'>";
            htmlContent += "        <span style='color: darkblue; font-family: 'Asty CF Std'; font-size: 10px; font-weight: 300;'>Destination: </span>";
            htmlContent += "        <span style='color: #115abb; font-family: 'Asty CF Std'; font-size: 10px; font-weight: 300;'>" + reservation.Destination.Description + "</span>";
            htmlContent += "    </div>";
            htmlContent += "    <div style='padding: 0.5rem;'>";
            htmlContent += "        <span style='color: darkblue; font-family: 'Asty CF Std'; font-size: 10px; font-weight: 300;'>Customer: </span>";
            htmlContent += "        <span style='color: #115abb; font-family: 'Asty CF Std'; font-size: 10px; font-weight: 300;'>" + reservation.Customer.Description + "</span>";
            htmlContent += "    </div>";
            htmlContent += "</div>";
            htmlContent += "<div id='passengers' style='padding: 0.5rem;>";
            htmlContent += "    <div class='header'>";
            htmlContent += "        <span style='color: darkblue; font-family:'Asty CF Std'; font-weight: 300;'>Passengers</span>";
            htmlContent += "    </div>";
            foreach (var passenger in reservation.Passengers) {
                htmlContent += "    <div class='passenger' style='padding: 0.5rem;'>";
                htmlContent += "        <span style='color: #115abb; font-family: 'Asty CF Std'; font-size: 10px; font-weight: 300;'>" + passenger.Lastname + " " + passenger.Firstname + "</span>";
                htmlContent += "    </div>";
            }
            htmlContent += "</div>";

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