using API.Features.Drivers;
using API.Model.Tests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.Model.Tests.Features.Drivers {

    public class Drivers {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new DriverValidator()
                .TestValidate(new DriverWriteDto { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Phones(string phones) {
            new DriverValidator()
                .TestValidate(new DriverWriteDto { Phones = phones })
                .ShouldHaveValidationErrorFor(x => x.Phones);
        }

    }

}