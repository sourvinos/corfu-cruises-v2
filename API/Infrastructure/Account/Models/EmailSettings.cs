namespace API.Infrastructure.Account {

    public class EmailSettings {

        public string From { get; set; }
        public string SmtpClient { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public EmailFooter EmailFooter { get; set; }

    }

    public class EmailFooter {
        public string LineB { get; set; }
        public string LineA { get; set; }
        public string LineC { get; set; }
    }

}