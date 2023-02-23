using FluentValidation;

namespace API.Features.Ports {

    public class PortValidator : AbstractValidator<PortWriteDto> {

        public PortValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Abbreviation).NotEmpty().MaximumLength(5);
            RuleFor(x => x.StopOrder).InclusiveBetween(1, to: 9);
        }

    }

}