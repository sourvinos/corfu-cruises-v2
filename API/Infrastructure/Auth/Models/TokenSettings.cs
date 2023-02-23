namespace API.Infrastructure.Auth {

    public class TokenSettings {

        public string Site { get; set; }
        public string Secret { get; set; }
        public string ExpireTime { get; set; }
        public string Audience { get; set; }
        public string ClientId { get; set; }

    }

}