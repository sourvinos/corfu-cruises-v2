import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Subject } from 'rxjs'
// Custom
import { CheckInEmailDialogService } from '../../classes/services/check-in-email-dialog.service'
import { CheckInService } from '../../classes/services/check-in.service'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageDialogService } from 'src/app/shared/services/message-dialog.service'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { ReservationHelperService } from 'src/app/features/reservations/classes/services/reservation.helper.service'
import { ReservationReadDto } from 'src/app/features/reservations/classes/dtos/form/reservation-read-dto'
import { ReservationWriteDto } from 'src/app/features/reservations/classes/dtos/form/reservation-write-dto'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'

@Component({
    selector: 'check-in-reservation-form',
    templateUrl: './check-in-reservation-form.component.html',
    styleUrls: ['./check-in-reservation-form.component.css']
})

export class CheckInReservationFormComponent {

    //#region variables

    public record: ReservationReadDto
    public feature = 'checkInReservationForm'
    public featureIcon = 'check-in'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public isAutoCompleteDisabled = true
    public isLoading = new Subject<boolean>()
    public parentUrl = ''

    public isNewRecord: boolean
    public passengerDifferenceColor: string
    public isReservationTabVisible: boolean
    public isPassengersTabVisible: boolean
    public isMiscTabVisible: boolean

    //#endregion

    constructor(private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private checkInEmailDialogService: CheckInEmailDialogService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageDialogService, private reservationHelperService: ReservationHelperService, private checkInService: CheckInService, private sessionStorageService: SessionStorageService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.getRecord()
        this.populateFields()
        this.setLocale()
        this.subscribeToInteractionService()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public checkForDifferenceBetweenTotalPaxAndPassengers(element?: any): boolean {
        return this.reservationHelperService.checkForDifferenceBetweenTotalPaxAndPassengers(element, this.form.value.totalPax, this.form.value.passengers.length)
    }

    public formatISODateToLocale(): string {
        return this.dateHelperService.formatISODateToLocale(this.form.value.date)
    }

    public getPassengerDifferenceColor(element?: any): void {
        this.passengerDifferenceColor = this.reservationHelperService.getPassengerDifferenceIcon(element, this.form.value.totalPax, this.form.value.passengers.length)
    }

    public doPaxCalculations(): void {
        this.calculateTotalPax()
        this.getPassengerDifferenceColor()
    }

    public doTasksAfterPassengerFormIsClosed(passengers: any): void {
        this.patchFormWithPassengers(passengers)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onSave(): void {
        this.saveRecord(this.flattenForm())
    }

    public onSendEmail(): void {
        this.checkInEmailDialogService.open(this.form.value.email, 'info', 'center-buttons', ['ok']).subscribe(response => {
            if (response) {
                this.form.patchValue((
                    {
                        email: response
                    }))
                this.checkInService.sendEmail(this.form.value.email).pipe(indicate(this.isLoading)).subscribe({
                    complete: () => {
                        this.helperService.doPostSaveFormTasks(this.messageSnackbarService.emailSent(), 'success', '', this.form, false, false)
                    },
                    error: () => {
                        this.helperService.doPostSaveFormTasks(this.messageSnackbarService.emailNotSent(), 'error', '', this.form)
                    }
                })

                // this.helperService.doPostSaveFormTasks(this.messageSnackbarService.emailSent(), 'success', '', this.form, true, false)
            }
        })
    }

    //#endregion

    //#region private methods

    private calculateTotalPax(): void {
        const totalPax = parseInt(this.form.value.adults, 10) + parseInt(this.form.value.kids, 10) + parseInt(this.form.value.free, 10)
        this.form.patchValue({ totalPax: Number(totalPax) ? totalPax : 0 })
    }

    private cleanup(): void {
        this.sessionStorageService.deleteItems([{ 'item': 'nationality', 'when': 'always' }])
    }

    private flattenForm(): ReservationWriteDto {
        return this.reservationHelperService.flattenForm(this.form.value)
    }

    private getRecord(): void {
        this.record = JSON.parse(this.localStorageService.getItem('reservation'))
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            reservationId: '',
            date: '',
            refNo: '',
            destination: '',
            customer: '',
            pickupPoint: '',
            exactPoint: '',
            time: '',
            adults: 0,
            kids: 0,
            free: 0,
            totalPax: 0,
            driver: '',
            port: '',
            ship: '',
            ticketNo: '',
            email: '',
            phones: '',
            remarks: '',
            imageBase64: '',
            passengers: [[]]
        })
    }

    private patchFormWithPassengers(passengers: any): void {
        this.form.patchValue({ passengers: passengers })
    }

    private populateFields(): void {
        this.form.setValue({
            reservationId: this.record.reservationId,
            date: this.record.date,
            refNo: this.record.refNo,
            destination: { 'id': this.record.destination.id, 'description': this.record.destination.description },
            customer: { 'id': this.record.customer.id, 'description': this.record.customer.description },
            pickupPoint: { 'id': this.record.pickupPoint.id, 'description': this.record.pickupPoint.description },
            exactPoint: this.record.pickupPoint.exactPoint,
            time: this.record.pickupPoint.time,
            driver: { 'id': this.record.driver.id, 'description': this.record.driver.description },
            ship: { 'id': this.record.ship.id, 'description': this.record.ship.description },
            port: { 'id': this.record.pickupPoint.port.id, 'description': this.record.pickupPoint.port.description },
            adults: this.record.adults,
            kids: this.record.kids,
            free: this.record.free,
            totalPax: this.record.totalPax,
            ticketNo: this.record.ticketNo,
            email: this.record.email,
            phones: this.record.phones,
            remarks: this.record.remarks,
            imageBase64: '',
            passengers: this.record.passengers
        })
    }

    private saveRecord(reservation: ReservationWriteDto): void {
        this.checkInService.save(reservation).pipe(indicate(this.isLoading)).subscribe({
            next: (response) => {
                this.helperService.doPostSaveFormTasks('RefNo: ' + this.reservationHelperService.formatRefNo(response.message), 'success', this.parentUrl, this.form)
                this.localStorageService.deleteItems([{ 'item': 'reservation', 'when': 'always' },])
                this.sessionStorageService.deleteItems([{ 'item': 'nationality', 'when': 'always' }])
            },
            error: (errorFromInterceptor) => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false, false)
            }
        })
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.subscribe(() => {
            this.setLocale()
        })
    }

    //#endregion

}
