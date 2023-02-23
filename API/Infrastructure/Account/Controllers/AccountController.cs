using System.Text;
using System.Threading.Tasks;
using API.Features.Users;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace API.Infrastructure.Account {

    [Route("api/[controller]")]
    public class AccountController : Controller {

        private readonly IEmailSender emailSender;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly SignInManager<UserExtended> signInManager;
        private readonly UserManager<UserExtended> userManager;

        public AccountController(IEmailSender emailSender, IHttpContextAccessor httpContextAccessor, SignInManager<UserExtended> signInManager, UserManager<UserExtended> userManager) {
            this.emailSender = emailSender;
            this.httpContextAccessor = httpContextAccessor;
            this.signInManager = signInManager;
            this.userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> ForgotPassword([FromBody] ForgotPasswordVM model) {
            return await SendEmail(model);
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<Response> ResetPassword([FromBody] ResetPasswordVM model) {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user != null) {
                var result = await userManager.ResetPasswordAsync(user, Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token)), model.Password);
                if (result.Succeeded) {
                    await signInManager.RefreshSignInAsync(user);
                    return new Response {
                        Code = 200,
                        Icon = Icons.Success.ToString(),
                        Message = ApiMessages.OK()
                    };
                } else {
                    throw new CustomException() {
                        ResponseCode = 412
                    };
                }
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };

            }
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "user, admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> ChangePassword([FromBody] ChangePasswordVM changePassword) {
            var user = await userManager.FindByIdAsync(changePassword.UserId);
            if (user != null) {
                var result = await userManager.ChangePasswordAsync(user, changePassword.CurrentPassword, changePassword.Password);
                if (result.Succeeded) {
                    await signInManager.RefreshSignInAsync(user);
                    return new Response {
                        Code = 200,
                        Icon = Icons.Success.ToString(),
                        Message = ApiMessages.OK()
                    };
                } else {
                    throw new CustomException() {
                        ResponseCode = 412
                    };
                }
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "admin")]
        public Response SendLoginCredentials([FromBody] LoginCredentialsVM model) {
            string baseUrl = $"{Request.Scheme}://{Request.Host.Value}{Request.PathBase.Value}";
            string loginLink = Url.Content($"{baseUrl}/login");
            var result = emailSender.SendLoginCredentials(model, loginLink);
            if (result.Successful) {
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                return new Response {
                    Code = 496,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.EmailNotSent()
                };
            }
        }

        [HttpGet("[action]")]
        [Authorize]
        public string GetConnectedUserId() {
            return Identity.GetConnectedUserId(httpContextAccessor);
        }

        [Authorize]
        [HttpGet("[action]")]
        public bool IsConnectedUserAdmin() {
            return Identity.IsUserAdmin(httpContextAccessor);
        }

        private async Task<Response> SendEmail(ForgotPasswordVM model) {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user != null && await userManager.IsEmailConfirmedAsync(user)) {
                string token = await userManager.GeneratePasswordResetTokenAsync(user);
                string tokenEncoded = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
                string baseUrl = $"{model.ReturnUrl}";
                string passwordResetLink = Url.Content($"{baseUrl}/#/resetPassword?email={model.Email}&token={tokenEncoded}");
                var response = emailSender.SendResetPasswordEmail(user.Displayname, user.Email, passwordResetLink, model.Language);
                return response.Successful ? new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                } : new Response {
                    Code = 498,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.EmailNotSent()
                };
            } else {
                return new Response {
                    Code = 498,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.EmailNotSent()
                };
            }
        }

    }

}