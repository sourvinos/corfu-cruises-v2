using API.Features.Ships;
using API.Model.Tests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.Model.Tests.Features.Ships {

    public class Ships {

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_ShipOwnerId(int shipOwnerId) {
            new ShipValidator()
                .TestValidate(new ShipWriteDto { ShipOwnerId = shipOwnerId })
                .ShouldHaveValidationErrorFor(x => x.ShipOwnerId);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new ShipValidator()
                .TestValidate(new ShipWriteDto { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_IMO(string imo) {
            new ShipValidator()
                .TestValidate(new ShipWriteDto { IMO = imo })
                .ShouldHaveValidationErrorFor(x => x.IMO);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Flag(string flag) {
            new ShipValidator()
                .TestValidate(new ShipWriteDto { Flag = flag })
                .ShouldHaveValidationErrorFor(x => x.Flag);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_RegistryNo(string registryNo) {
            new ShipValidator()
                .TestValidate(new ShipWriteDto { RegistryNo = registryNo })
                .ShouldHaveValidationErrorFor(x => x.RegistryNo);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Manager(string manager) {
            new ShipValidator()
                .TestValidate(new ShipWriteDto { Manager = manager })
                .ShouldHaveValidationErrorFor(x => x.Manager);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_ManagerInGreece(string managerInGreece) {
            new ShipValidator()
                .TestValidate(new ShipWriteDto { ManagerInGreece = managerInGreece })
                .ShouldHaveValidationErrorFor(x => x.ManagerInGreece);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Agent(string agent) {
            new ShipValidator()
                .TestValidate(new ShipWriteDto { Agent = agent })
                .ShouldHaveValidationErrorFor(x => x.Agent);
        }

    }

}