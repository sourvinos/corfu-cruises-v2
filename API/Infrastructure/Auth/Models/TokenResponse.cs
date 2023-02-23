using System;

namespace API.Infrastructure.Auth {

    public class TokenResponse {

        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime Expiration { get; set; }

    }

}