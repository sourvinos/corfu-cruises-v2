using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Infrastructure.Account {

    public class ForgotPasswordValidator : AbstractValidator<ForgotPasswordVM> {

        public ForgotPasswordValidator() {
            RuleFor(x => x.Email).NotEmpty().Must(EmailHelpers.BeValidEmailAddress);
            RuleFor(x => x.Language).NotEmpty();
            RuleFor(x => x.ReturnUrl).NotEmpty();
        }

    }

}