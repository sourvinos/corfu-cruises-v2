using API.Features.Reservations;
using API.Model.Tests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.Model.Tests.Features.Reservations {

    public class Reservations {

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_CustomerId(int customerId) {
            new ReservationValidator()
                .TestValidate(new ReservationWriteDto { CustomerId = customerId })
                .ShouldHaveValidationErrorFor(x => x.CustomerId);
        }

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_DestinationId(int destinationId) {
            new ReservationValidator()
                .TestValidate(new ReservationWriteDto { DestinationId = destinationId })
                .ShouldHaveValidationErrorFor(x => x.DestinationId);
        }

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_PickupPointId(int pickupPointId) {
            new ReservationValidator()
                .TestValidate(new ReservationWriteDto { PickupPointId = pickupPointId })
                .ShouldHaveValidationErrorFor(x => x.PickupPointId);
        }

        [Theory]
        [ClassData(typeof(ValidateDate))]
        public void Invalid_Date(string date) {
            new ReservationValidator()
                .TestValidate(new ReservationWriteDto { Date = date })
                .ShouldHaveValidationErrorFor(x => x.Date);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_TicketNo(string ticketNo) {
            new ReservationValidator()
                .TestValidate(new ReservationWriteDto { TicketNo = ticketNo })
                .ShouldHaveValidationErrorFor(x => x.TicketNo);
        }

        [Theory]
        [ClassData(typeof(ValidateEmail))]
        public void Invalid_Email(string email) {
            new ReservationValidator()
               .TestValidate(new ReservationWriteDto { Email = email })
               .ShouldHaveValidationErrorFor(x => x.Email);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Phones(string phones) {
            new ReservationValidator()
               .TestValidate(new ReservationWriteDto { Phones = phones })
               .ShouldHaveValidationErrorFor(x => x.Phones);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Remarks(string remarks) {
            new ReservationValidator()
               .TestValidate(new ReservationWriteDto { Remarks = remarks })
               .ShouldHaveValidationErrorFor(x => x.Remarks);
        }

        [Theory]
        [ClassData(typeof(ValidateDate))]
        public void Invalid_Passenger_Birthdate(string date) {
            new PassengerValidator()
                .TestValidate(new PassengerWriteDto { Birthdate = date })
                .ShouldHaveValidationErrorFor(x => x.Birthdate);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Passenger_Lastname(string lastname) {
            new PassengerValidator()
               .TestValidate(new PassengerWriteDto { Lastname = lastname })
               .ShouldHaveValidationErrorFor(x => x.Lastname);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Passenger_Firstname(string firstname) {
            new PassengerValidator()
               .TestValidate(new PassengerWriteDto { Firstname = firstname })
               .ShouldHaveValidationErrorFor(x => x.Firstname);
        }

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_Passenger_GenderId(int genderId) {
            new PassengerValidator()
               .TestValidate(new PassengerWriteDto { GenderId = genderId })
               .ShouldHaveValidationErrorFor(x => x.GenderId);
        }

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_Passenger_NationalityId(int nationalityId) {
            new PassengerValidator()
               .TestValidate(new PassengerWriteDto { NationalityId = nationalityId })
               .ShouldHaveValidationErrorFor(x => x.NationalityId);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Passenger_SpecialCare(string specialCare) {
            new PassengerValidator()
               .TestValidate(new PassengerWriteDto { SpecialCare = specialCare })
               .ShouldHaveValidationErrorFor(x => x.SpecialCare);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Passenger_Remarks(string remarks) {
            new PassengerValidator()
               .TestValidate(new PassengerWriteDto { Remarks = remarks })
               .ShouldHaveValidationErrorFor(x => x.Remarks);
        }

    }

}