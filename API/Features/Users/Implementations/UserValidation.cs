using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Users {

    public class UserValidation : IUserValidation<IUser> {

        #region variables

        private readonly AppDbContext context;
        private readonly IHttpContextAccessor httpContext;
        private readonly UserManager<UserExtended> userManager;

        #endregion

        public UserValidation(AppDbContext context, IHttpContextAccessor httpContext, UserManager<UserExtended> userManager) {
            this.context = context;
            this.httpContext = httpContext;
            this.userManager = userManager;
        }

        public int IsValid(IUser user) {
            return true switch {
                var x when x == !IsValidCustomer(user) && user.CustomerId != null => 450,
                _ => 200,
            };
        }

        public bool IsUserOwner(string userId) {
            var connectedUserId = Identity.GetConnectedUserId(httpContext);
            var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, userId);
            return connectedUserDetails.Id == connectedUserId;
        }

        private bool IsValidCustomer(IUser user) {
            return context.Customers
                .AsNoTracking()
                .SingleOrDefault(x => x.Id == user.CustomerId && x.IsActive) != null;
        }

    }

}
