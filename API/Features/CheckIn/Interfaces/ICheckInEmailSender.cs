namespace API.Features.CheckIn {

    public interface ICheckInEmailSender {

        SendEmailResponse SendEmail(CheckInEmailVM email);

    }

    public class SendEmailResponse {

        public bool Successful => ErrorMsg == null;
        public string ErrorMsg;

    }


}