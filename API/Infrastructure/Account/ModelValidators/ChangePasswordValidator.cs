using FluentValidation;

namespace API.Infrastructure.Account {

    public class ChangePasswordValidator : AbstractValidator<ChangePasswordVM> {

        public ChangePasswordValidator() {
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.CurrentPassword).NotEmpty();
            RuleFor(x => x.Password).NotEmpty().MinimumLength(10).MaximumLength(128);
            RuleFor(x => x.Password).Equal(x => x.ConfirmPassword);
        }

    }

}