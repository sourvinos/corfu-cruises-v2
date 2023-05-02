import { Injectable } from '@angular/core'
// Custom
import { ConnectedUser } from 'src/app/shared/classes/connected-user'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { OkIconService } from './ok-icon.service'
import { PassengerWriteDto } from '../dtos/form/passenger-write-dto'
import { ReservationReadDto } from '../dtos/form/reservation-read-dto'
import { ReservationWriteDto } from '../dtos/form/reservation-write-dto'
import { SessionStorageService } from './../../../../shared/services/session-storage.service'
import { VoucherDto } from './../voucher/dtos/voucher-dto'
import { VoucherPassengerDto } from '../voucher/dtos/voucher-passenger-dto'
import { WarningIconService } from './warning-icon.service'

@Injectable({ providedIn: 'root' })

export class ReservationHelperService {

    constructor(private dateHelperService: DateHelperService, private emojiService: EmojiService, private okIconService: OkIconService, private sessionStorageService: SessionStorageService, private warningIconService: WarningIconService) { }

    //#region public methods

    public checkForDifferenceBetweenTotalPaxAndPassengers(element: any, totalPax: number, totalPassengers: number): boolean {
        if (totalPassengers > 0) {
            const passengerDifference = totalPax - (element != null ? element : totalPassengers)
            switch (true) {
                case passengerDifference == 0:
                    return true
                case passengerDifference < 0:
                    return false
                case passengerDifference > 0:
                    return true
            }
        } else {
            return true
        }
    }

    public createVoucher(form: any): VoucherDto {
        const voucher = {
            'date': this.dateHelperService.formatISODateToLocale(form.date),
            'refNo': form.refNo,
            'destinationDescription': form.destination.description,
            'customerDescription': form.customer.description,
            'pickupPointDescription': form.pickupPoint.description,
            'pickupPointExactPoint': form.exactPoint,
            'pickupPointTime': form.time,
            'adults': form.adults,
            'kids': form.kids,
            'free': form.free,
            'totalPax': form.totalPax,
            'driverDescription': form.driver.description,
            'ticketNo': form.ticketNo,
            'remarks': form.remarks,
            'validPassengerIcon': this.getValidPassengerIconForVoucher(this.validatePassengerCountForVoucher(form.totalPax, form.passengers)),
            'qr': form.ticketNo,
            'passengers': this.mapVoucherPassengers(form.passengers)
        }
        return voucher
    }

    public flattenForm(form: any): ReservationWriteDto {
        return {
            reservationId: form.reservationId != '' ? form.reservationId : null,
            customerId: form.customer.id,
            destinationId: form.destination.id,
            driverId: form.driver ? form.driver.id : null,
            pickupPointId: form.pickupPoint.id,
            portId: form.port.id,
            shipId: form.ship ? form.ship.id : null,
            date: this.dateHelperService.formatDateToIso(new Date(form.date)),
            refNo: form.refNo,
            ticketNo: form.ticketNo,
            email: form.email,
            phones: form.phones,
            adults: form.adults,
            kids: form.kids,
            free: form.free,
            remarks: form.remarks,
            passengers: this.mapPassengers(form)
        }
    }

    public getLinkedCustomer(isNewRecord: boolean): any {
        if (ConnectedUser.isAdmin == false && isNewRecord) {
            return JSON.parse(this.sessionStorageService.getItem('customers')).filter((x: { id: number }) => x.id == ConnectedUser.customerId)
        }
    }

    public getPassengerDifferenceIcon(element: any, totalPax: number, totalPassengers: number): any {
        if (totalPassengers > 0) {
            const passengerDifference = totalPax - (element != null ? element : totalPassengers)
            switch (true) {
                case passengerDifference == 0:
                    return 'green'
                case passengerDifference < 0:
                    return 'red'
                case passengerDifference > 0:
                    return 'yellow'
            }
        } else {
            return 'yellow'
        }
    }

    public createCachedReservation(form: any): ReservationReadDto {
        return {
            reservationId: form.reservationId,
            customer: form.customer,
            destination: form.destination,
            driver: form.driver,
            pickupPoint: {
                id: form.pickupPoint.id,
                description: form.pickupPoint.description,
                exactPoint: form.exactPoint,
                time: form.time,
                port: {
                    id: form.port.id,
                    description: form.port.description
                }
            },
            port: form.port,
            ship: form.ship,
            date: form.date,
            refNo: form.refNo,
            email: form.email,
            phones: form.phones,
            remarks: form.remarks,
            adults: form.adults,
            kids: form.kids,
            free: form.free,
            totalPax: form.totalPax,
            ticketNo: form.ticketNo,
            passengers: form.passengers
        }
    }

    //#endregion

    //#region private methods

    private getValidPassengerIconForVoucher(isValid: boolean): string {
        if (isValid) {
            return this.okIconService.getIcon()
        } else {
            return this.warningIconService.getIcon()
        }
    }

    private mapPassengers(form: any): PassengerWriteDto[] {
        const passengers = []
        form.passengers.forEach((passenger: any) => {
            const x: PassengerWriteDto = {
                reservationId: form.reservationId,
                genderId: passenger.gender.id,
                nationalityId: passenger.nationality.id,
                occupantId: 2,
                lastname: passenger.lastname,
                firstname: passenger.firstname,
                birthdate: this.dateHelperService.formatDateToIso(new Date(passenger.birthdate)),
                specialCare: passenger.specialCare,
                remarks: passenger.remarks,
                isCheckedIn: passenger.isCheckedIn
            }
            passengers.push(x)
        })
        return passengers
    }

    private mapVoucherPassengers(passengers: any[]): VoucherPassengerDto[] {
        const x = []
        passengers.forEach((element: any) => {
            const passenger = {
                'lastname': element.lastname,
                'firstname': element.firstname
            }
            x.push(passenger)
        })
        return x
    }

    private validatePassengerCountForVoucher(reservationPax: any, passengerCount: any): boolean {
        return reservationPax == passengerCount.length ? true : false
    }

    //#endregion

}
