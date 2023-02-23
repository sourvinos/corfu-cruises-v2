namespace API.Infrastructure.Responses {

    public class ResponseWithBody : IResponse {

        public object Body { get; set; }
        public int Code { get; set; }
        public string Icon { get; set; }
        public string Message { get; set; }
 
    }

}