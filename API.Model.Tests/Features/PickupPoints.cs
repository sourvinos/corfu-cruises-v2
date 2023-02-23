using API.Features.PickupPoints;
using API.Model.Tests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.Model.Tests.Features.PickupPoints {

    public class PickupPoints {

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_RouteId(int routeId) {
            new PickupPointValidator()
                .TestValidate(new PickupPointWriteDto { CoachRouteId = routeId })
                .ShouldHaveValidationErrorFor(x => x.CoachRouteId);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new PickupPointValidator()
                .TestValidate(new PickupPointWriteDto { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_ExactPoint(string exactPoint) {
            new PickupPointValidator()
                .TestValidate(new PickupPointWriteDto { ExactPoint = exactPoint })
                .ShouldHaveValidationErrorFor(x => x.ExactPoint);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateTime))]
        public void Invalid_Time(string time) {
            new PickupPointValidator()
                .TestValidate(new PickupPointWriteDto { Time = time })
                .ShouldHaveValidationErrorFor(x => x.Time);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Coordinates(string coordinates) {
            new PickupPointValidator()
                .TestValidate(new PickupPointWriteDto { Coordinates = coordinates })
                .ShouldHaveValidationErrorFor(x => x.Coordinates);
        }

    }

}