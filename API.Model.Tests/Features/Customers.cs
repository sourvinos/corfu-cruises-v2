using API.Features.Customers;
using API.Model.Tests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.Model.Tests.Features.Customers {

    public class Customers {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new CustomerValidator()
                .TestValidate(new CustomerWriteDto { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Profession(string profession) {
            new CustomerValidator()
               .TestValidate(new CustomerWriteDto { Profession = profession })
               .ShouldHaveValidationErrorFor(x => x.Profession);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Address(string address) {
            new CustomerValidator()
                .TestValidate(new CustomerWriteDto { Address = address })
                .ShouldHaveValidationErrorFor(x => x.Address);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Phones(string phones) {
            new CustomerValidator()
               .TestValidate(new CustomerWriteDto { Phones = phones })
               .ShouldHaveValidationErrorFor(x => x.Phones);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_PersonInCharge(string personInCharge) {
            new CustomerValidator()
                .TestValidate(new CustomerWriteDto { PersonInCharge = personInCharge })
                .ShouldHaveValidationErrorFor(x => x.PersonInCharge);
        }

        [Theory]
        [ClassData(typeof(ValidateEmail))]
        public void Invalid_Email(string email) {
            new CustomerValidator()
               .TestValidate(new CustomerWriteDto { Email = email })
               .ShouldHaveValidationErrorFor(x => x.Email);
        }

    }

}