using Microsoft.AspNetCore.Mvc;

namespace API.Infrastructure.DotNetVersion {

    [Route("api/[controller]")]
    public class DotNetVersionController : ControllerBase {

        [HttpGet]
        public string GetDotNetVersion() {
            return System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription;
        }

    }

}