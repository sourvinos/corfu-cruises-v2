using System;

namespace API.Infrastructure.Auth {

    public class Login {

        public string UserId { get; set; }
        public bool IsAdmin { get; set; }
        public string Displayname { get; set; }
        public int? CustomerId { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime Expiration { get; set; }
        public string DotNetVersion { get; set; }

    }

}