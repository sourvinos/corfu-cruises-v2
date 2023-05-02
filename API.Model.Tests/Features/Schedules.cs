using API.Features.Schedules;
using API.Model.Tests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.Model.Tests.Features.Schedules {

    public class Schedules {

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_DestinationId(int destinationId) {
            new ScheduleValidator()
                .TestValidate(new ScheduleWriteDto { DestinationId = destinationId })
                .ShouldHaveValidationErrorFor(x => x.DestinationId);
        }

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_PortId(int portId) {
            new ScheduleValidator()
                .TestValidate(new ScheduleWriteDto { PortId = portId })
                .ShouldHaveValidationErrorFor(x => x.PortId);
        }

        [Theory]
        [ClassData(typeof(ValidateDate))]
        public void Invalid_Date(string date) {
            new ScheduleValidator()
                .TestValidate(new ScheduleWriteDto { Date = date })
                .ShouldHaveValidationErrorFor(x => x.Date);
        }

        [Theory]
        [ClassData(typeof(ValidateIntegerBetweenZeroAndOneThousand))]
        public void Invalid_MaxPassengers(int maxPassengers) {
            new ScheduleValidator()
                .TestValidate(new ScheduleWriteDto { MaxPax = maxPassengers })
                .ShouldHaveValidationErrorFor(x => x.MaxPax);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateTime))]
        public void Invalid_DepartureTime(string time) {
            new ScheduleValidator()
                .TestValidate(new ScheduleWriteDto { Time = time })
                .ShouldHaveValidationErrorFor(x => x.Time);
        }

    }

}