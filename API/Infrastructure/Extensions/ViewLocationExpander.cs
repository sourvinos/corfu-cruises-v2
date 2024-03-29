using Microsoft.AspNetCore.Mvc.Razor;
using System.Collections.Generic;

namespace API.Infrastructure.Extensions {

    public class ViewLocationExpander : IViewLocationExpander {

        public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations) =>
              new List<string> {
                  "/Infrastructure/Email/Views/{0}.cshtml",
                  "/Features/Vouchers/Views/{0}.cshtml",
              };

        public void PopulateValues(ViewLocationExpanderContext context) { }

    }

}