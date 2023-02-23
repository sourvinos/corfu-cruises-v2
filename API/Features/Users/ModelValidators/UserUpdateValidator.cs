using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Features.Users {

    public class UserUpdateValidator : AbstractValidator<UserUpdateDto> {

        public UserUpdateValidator() {
            RuleFor(x => x.Username).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Displayname).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Email).Must(EmailHelpers.BeValidEmailAddress).MaximumLength(128);
        }

    }

}