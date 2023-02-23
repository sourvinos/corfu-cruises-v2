using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Infrastructure.Account {

    public class ResetPasswordValidator : AbstractValidator<ResetPasswordVM> {

        public ResetPasswordValidator() {
            RuleFor(x => x.Email).NotEmpty().Must(EmailHelpers.BeValidEmailAddress);
            RuleFor(x => x.Password).NotEmpty().MinimumLength(10).MaximumLength(128);
            RuleFor(x => x.Password).Equal(x => x.ConfirmPassword);
            RuleFor(x => x.Token).NotEmpty();
        }

    }

}