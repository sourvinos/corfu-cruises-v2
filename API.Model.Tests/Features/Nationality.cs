using API.Features.Nationalities;
using API.Model.Tests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.Model.Tests.Features.Nationalities {

    public class Nationalities {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new NationalityValidator()
                .TestValidate(new NationalityWriteDto { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Code(string code) {
            new NationalityValidator()
                .TestValidate(new NationalityWriteDto { Code = code })
                .ShouldHaveValidationErrorFor(x => x.Code);
        }

    }

}