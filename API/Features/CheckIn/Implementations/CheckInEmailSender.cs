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

            htmlContent += "<h1 style = 'font-weight: 500;'><span style = 'color: #0078d7;'>" + reservation.RefNo + "</span></h1>";
            htmlContent += "<p>Date: " + DateHelpers.FormatDateStringToLocaleString(reservation.Date) + "<p>";
            htmlContent += "<p>Ticket: " + reservation.TicketNo + "<p>";
            htmlContent += "<p>Destination: " + reservation.Destination.Description + "<p>";
            htmlContent += "<p>Customer: " + reservation.Customer.Description + "<p>";
            htmlContent += "<p>Pickup point: " + reservation.PickupPoint.Description + "<p>";
            htmlContent += "<p>Exact point: " + reservation.PickupPoint.ExactPoint + "<p>";
            htmlContent += "<p>Adults: " + reservation.Adults + "<p>";
            htmlContent += "<p>Kids: " + reservation.Kids + "<p>";
            htmlContent += "<p>Free: " + reservation.Free + "<p>";
            htmlContent += "<p>Total pax: " + reservation.TotalPax + "<p>";
            htmlContent += "<p>Phones: " + reservation.Phones + "<p>";
            htmlContent += "<p>Remarks: " + reservation.Remarks + "<p>";

            htmlContent += "<p>";
            htmlContent += "<p>Passengers</p>";

            foreach (var passenger in reservation.Passengers) {
                htmlContent += "<p>" + passenger.Lastname + " " + passenger.Firstname + "</p>";
            }

            htmlContent += "<p></p>";
            htmlContent += "<p></p>";
            htmlContent += "<p>Enjoy your trip!</p>";

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