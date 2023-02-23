using System;

namespace API.Infrastructure.Auth {

    public class Token {

        public int Id { get; set; }
        public string ClientId { get; set; }
        public string UserId { get; set; }
        public string Value { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ExpiryTime { get; set; }

    }

}