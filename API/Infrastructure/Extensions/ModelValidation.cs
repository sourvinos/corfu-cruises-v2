using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace API.Infrastructure.Extensions {

    public class ModelValidationAttribute : IActionFilter {

        public void OnActionExecuting(ActionExecutingContext context) {
            if (!context.ModelState.IsValid) {
                context.Result = new BadRequestObjectResult(context.ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage));
            }
        }

        public void OnActionExecuted(ActionExecutedContext context) { }

    }

}