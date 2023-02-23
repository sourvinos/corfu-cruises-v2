using API.Features.Ports;
using API.Model.Tests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.Model.Tests.Features.Ports {

    public class Ports {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Abbreviation(string abbreviation) {
            new PortValidator()
                .TestValidate(new PortWriteDto { Abbreviation = abbreviation })
                .ShouldHaveValidationErrorFor(x => x.Abbreviation);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new PortValidator()
                .TestValidate(new PortWriteDto { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateIntegerBetweenOneAndTen))]
        public void Invalid_Port_Order(int stopOrder) {
            new PortValidator()
                .TestValidate(new PortWriteDto { StopOrder = stopOrder })
                .ShouldHaveValidationErrorFor(x => x.StopOrder);
        }

    }

}