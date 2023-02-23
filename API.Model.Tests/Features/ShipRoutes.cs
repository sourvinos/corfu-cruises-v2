using API.Features.ShipRoutes;
using API.Model.Tests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.Model.Tests.Features.ShipRoutes {

    public class ShipRoutes {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteDto { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_FromPort(string fromPort) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteDto { FromPort = fromPort })
                .ShouldHaveValidationErrorFor(x => x.FromPort);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateTime))]
        public void Invalid_FromTime(string fromTime) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteDto { FromTime = fromTime })
                .ShouldHaveValidationErrorFor(x => x.FromTime);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_ViaPort(string viaPort) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteDto { ViaPort = viaPort })
                .ShouldHaveValidationErrorFor(x => x.ViaPort);
        }

        [Theory]
        [ClassData(typeof(ValidateTime))]
        public void Invalid_ViaTime(string viaTime) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteDto { ViaTime = viaTime })
                .ShouldHaveValidationErrorFor(x => x.ViaTime);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_ToPort(string toPort) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteDto { ToPort = toPort })
                .ShouldHaveValidationErrorFor(x => x.ToPort);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateTime))]
        public void Invalid_ToTime(string toTime) {
            new ShipRouteValidator()
                .TestValidate(new ShipRouteWriteDto { ToTime = toTime })
                .ShouldHaveValidationErrorFor(x => x.ToTime);
        }

    }

}