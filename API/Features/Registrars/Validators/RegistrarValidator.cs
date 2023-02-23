using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Features.Registrars {

    public class RegistrarValidator : AbstractValidator<RegistrarWriteDto> {

        public RegistrarValidator() {
            RuleFor(x => x.ShipId).NotEmpty();
            RuleFor(x => x.Fullname).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Phones).MaximumLength(128);
            RuleFor(x => x.Email).Must(EmailHelpers.BeEmptyOrValidEmailAddress).MaximumLength(128);
            RuleFor(x => x.Fax).MaximumLength(128);
            RuleFor(x => x.Address).MaximumLength(128);
        }

    }

}