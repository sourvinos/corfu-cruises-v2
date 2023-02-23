namespace API.Infrastructure.Responses {

    public interface IResponse {

        int Code { get; set; }
        string Icon { get; set; }
        string Message { get; set; }

    }

}