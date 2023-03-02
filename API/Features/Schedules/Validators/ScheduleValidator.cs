using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Features.Schedules {

    public class ScheduleValidator : AbstractValidator<ScheduleWriteDto> {

        public ScheduleValidator() {
            // FKs
            RuleFor(x => x.DestinationId).NotEmpty();
            RuleFor(x => x.PortId).NotEmpty();
            // Fields
            RuleFor(x => x.Date).Must(DateHelpers.BeCorrectFormat);
            RuleFor(x => x.MaxPax).InclusiveBetween(0, 1000);
            RuleFor(x => x.Time).Must(TimeHelpers.BeValidTime);
        }

    }

}