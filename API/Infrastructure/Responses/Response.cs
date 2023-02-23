namespace API.Infrastructure.Responses {

    public class Response : IResponse {
        
        public int Code { get; set; }
        public string Icon { get; set; }
        public string Message { get; set; }

    }

}