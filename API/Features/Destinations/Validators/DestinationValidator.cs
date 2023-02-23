using FluentValidation;

namespace API.Features.Destinations {

    public class DestinationValidator : AbstractValidator<DestinationWriteDto> {

        public DestinationValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Abbreviation).NotEmpty().MaximumLength(5);
        }

    }

}