using API.Features.Registrars;
using API.Model.Tests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.Model.Tests.Features.Registrars {

    public class Registrars {

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_ShipId(int shipId) {
            new RegistrarValidator()
                .TestValidate(new RegistrarWriteDto { ShipId = shipId })
                .ShouldHaveValidationErrorFor(x => x.ShipId);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Fullname(string fullname) {
            new RegistrarValidator()
                .TestValidate(new RegistrarWriteDto { Fullname = fullname })
                .ShouldHaveValidationErrorFor(x => x.Fullname);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Phones(string phones) {
            new RegistrarValidator()
                .TestValidate(new RegistrarWriteDto { Phones = phones })
                .ShouldHaveValidationErrorFor(x => x.Phones);
        }

        [Theory]
        [ClassData(typeof(ValidateEmail))]
        public void Invalid_Email(string email) {
            new RegistrarValidator()
                .TestValidate(new RegistrarWriteDto { Email = email })
                .ShouldHaveValidationErrorFor(x => x.Email);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Fax(string fax) {
            new RegistrarValidator()
                .TestValidate(new RegistrarWriteDto { Fax = fax })
                .ShouldHaveValidationErrorFor(x => x.Fax);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Address(string address) {
            new RegistrarValidator()
                .TestValidate(new RegistrarWriteDto { Address = address })
                .ShouldHaveValidationErrorFor(x => x.Address);
        }

    }

}