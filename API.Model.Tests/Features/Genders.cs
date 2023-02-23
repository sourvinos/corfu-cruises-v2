using API.Features.Genders;
using API.Model.Tests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.Model.Tests.Features.Genders {

    public class Genders {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new GenderValidator()
                .TestValidate(new GenderWriteDto { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

    }

}