using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Features.ShipRoutes {

    public class ShipRouteValidator : AbstractValidator<ShipRouteWriteDto> {

        public ShipRouteValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.FromPort).NotEmpty().MaximumLength(128);
            RuleFor(x => x.FromTime).Must(TimeHelpers.BeValidTime);
            RuleFor(x => x.ViaPort).MaximumLength(128);
            RuleFor(x => x.ViaTime).Must(TimeHelpers.BeEmptyOrValidTime);
            RuleFor(x => x.ToPort).NotEmpty().MaximumLength(128);
            RuleFor(x => x.ToTime).Must(TimeHelpers.BeValidTime);
        }

    }

}