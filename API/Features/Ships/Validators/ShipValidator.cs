using FluentValidation;

namespace API.Features.Ships {

    public class ShipValidator : AbstractValidator<ShipWriteDto> {

        public ShipValidator() {
            RuleFor(x => x.ShipOwnerId).NotEmpty();
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.IMO).MaximumLength(128);
            RuleFor(x => x.Flag).MaximumLength(128);
            RuleFor(x => x.RegistryNo).MaximumLength(128);
            RuleFor(x => x.Manager).MaximumLength(128);
            RuleFor(x => x.ManagerInGreece).MaximumLength(128);
            RuleFor(x => x.Agent).MaximumLength(128);
        }

    }

}