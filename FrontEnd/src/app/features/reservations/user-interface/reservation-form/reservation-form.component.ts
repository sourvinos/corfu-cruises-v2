import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'
import { map, startWith } from 'rxjs/operators'
// Custom
import { ConnectedUser } from 'src/app/shared/classes/connected-user'
import { CustomerActiveVM } from '../../../customers/classes/view-models/customer-active-vm'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DestinationActiveVM } from 'src/app/features/destinations/classes/view-models/destination-active-vm'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { DriverActiveVM } from '../../../drivers/classes/view-models/driver-active-vm'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { OkIconService } from '../../classes/services/ok-icon.service'
import { PassengerWriteDto } from '../../classes/dtos/form/passenger-write-dto'
import { PickupPointDropdownVM } from 'src/app/features/pickupPoints/classes/view-models/pickupPoint-dropdown-vm'
import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'
import { ReservationReadDto } from '../../classes/dtos/form/reservation-read-dto'
import { ReservationService } from '../../classes/services/reservation.service'
import { ReservationWriteDto } from '../../classes/dtos/form/reservation-write-dto'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { ValidationService } from './../../../../shared/services/validation.service'
import { VoucherService } from '../../classes/voucher/services/voucher.service'
import { WarningIconService } from '../../classes/services/warning-icon.service'

@Component({
    selector: 'reservation-form',
    templateUrl: './reservation-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './reservation-form.component.css']
})

export class ReservationFormComponent {

    //#region variables

    private record: ReservationReadDto
    private recordId: string
    private subscription = new Subscription()
    public feature = 'reservationForm'
    public featureIcon = 'reservations'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public isAutoCompleteDisabled = true
    public isLoading = new Subject<boolean>()
    public parentUrl: string

    public arrowIcon = new BehaviorSubject('arrow_drop_down')
    public dropdownCustomers: Observable<CustomerActiveVM[]>
    public dropdownDestinations: Observable<DestinationActiveVM[]>
    public dropdownDrivers: Observable<DriverActiveVM[]>
    public dropdownPickupPoints: Observable<PickupPointDropdownVM[]>
    public dropdownPorts: Observable<PortActiveVM[]>
    public dropdownShips: Observable<DriverActiveVM[]>

    public isNewRecord: boolean
    public passengerDifferenceIcon: string
    public isReservationTabVisible: boolean
    public isPassengersTabVisible: boolean
    public isMiscTabVisible: boolean

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private dialogService: DialogService, private emojiService: EmojiService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private okIconService: OkIconService, private reservationService: ReservationService, private router: Router, private sessionStorageService: SessionStorageService, private voucherService: VoucherService, private warningIconService: WarningIconService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.updateFieldsAfterEmptyPickupPoint()
        this.setRecordId()
        this.setNewRecord()
        this.doNewOrEditTasks()
        this.doPostInitTasks()
    }

    ngAfterViewInit(): void {
        this.focusOnField()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public autocompleteFields(subject: { description: any }): any {
        return subject ? subject.description : undefined
    }

    public checkForEmptyAutoComplete(event: { target: { value: any } }): void {
        if (event.target.value == '') this.isAutoCompleteDisabled = true
    }

    public checkForTempPassengers(): boolean {
        return this.sessionStorageService.getItem('passengers') != ''
    }

    public checkTotalPaxAgainstPassengerCount(element?: any): boolean {
        if (this.form.value.passengers.length > 0) {
            const passengerDifference = this.form.value.totalPax - (element != null ? element : this.form.value.passengers.length)
            switch (true) {
                case passengerDifference == 0:
                    this.passengerDifferenceIcon = this.emojiService.getEmoji('green-circle')
                    return true
                case passengerDifference < 0:
                    this.passengerDifferenceIcon = this.emojiService.getEmoji('red-circle')
                    return false
                case passengerDifference > 0:
                    this.passengerDifferenceIcon = this.emojiService.getEmoji('yellow-circle')
                    return true
            }
        } else {
            this.passengerDifferenceIcon = this.emojiService.getEmoji('yellow-circle')
            return true
        }
    }

    public doPaxCalculations(): void {
        this.calculateTotalPax()
        this.checkTotalPaxAgainstPassengerCount()
    }

    public doVoucherTasksOnClient(): void {
        this.voucherService.createVoucherOnClient(this.createVoucherFromReservation())
    }

    public doVoucherTasksOnServer(): void {
        this.modalActionResultService.open(this.messageSnackbarService.featureNotAvailable(), 'error', ['ok'])
    }

    public enableOrDisableAutoComplete(event: any): void {
        this.isAutoCompleteDisabled = this.helperService.enableOrDisableAutoComplete(event)
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public isAdmin(): boolean {
        return ConnectedUser.isAdmin
    }

    public isAdminOrNewRecord(): boolean {
        return ConnectedUser.isAdmin || this.recordId == null
    }

    public onDelete(): void {
        this.dialogService.open(this.messageSnackbarService.warning(), 'warning', 'right-buttons', ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.reservationService.delete(this.form.value.reservationId).pipe(indicate(this.isLoading)).subscribe({
                    complete: () => {
                        this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
                        this.sessionStorageService.deleteItems([{ 'item': 'passengers', 'when': 'always' }])
                    },
                    error: (errorFromInterceptor) => {
                        this.modalActionResultService.open(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', ['ok'])
                    }
                })
            }
        })
    }

    public onSave(): void {
        this.saveRecord(this.flattenForm())
    }

    public openOrCloseAutoComplete(trigger: MatAutocompleteTrigger, element: any): void {
        this.helperService.openOrCloseAutocomplete(this.form, element, trigger)
    }

    public patchFormWithPassengers(passengers: any): void {
        this.form.patchValue({ passengers: passengers })
    }

    public showReservationTab(): void {
        this.isReservationTabVisible = true
        this.isPassengersTabVisible = false
        this.isMiscTabVisible = false
    }

    public showPassengersTab(): void {
        this.isReservationTabVisible = false
        this.isPassengersTabVisible = true
        this.isMiscTabVisible = false
    }

    public showMiscTab(): void {
        this.isReservationTabVisible = false
        this.isPassengersTabVisible = false
        this.isMiscTabVisible = true
    }

    public updateFieldsAfterPickupPointSelection(value: PickupPointDropdownVM): void {
        this.form.patchValue({
            exactPoint: value.exactPoint,
            time: value.time,
            port: {
                'id': value.port.id,
                'description': value.port.description
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
        this.subscription.unsubscribe()
    }

    private createVoucherFromReservation(): any {
        const form = this.form.value
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
            'passengers': this.mapVoucherPassengers()
        }
        return voucher
    }

    private doNewOrEditTasks(): void {
        if (this.isNewRecord) {
            this.getStoredDate()
            this.getStoredDestination()
        } else {
            this.getRecord()
            this.populateFields()
        }
    }

    private doPostInitTasks(): void {
        this.getLinkedCustomer()
        this.populateDropDowns()
        this.setLocale()
        this.setParentUrl()
        this.subscribeToInteractionService()
        this.updateTabVisibility()
    }

    private filterAutocomplete(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): ReservationWriteDto {
        const form = this.form.value
        const reservation: ReservationWriteDto = {
            reservationId: form.reservationId != '' ? form.reservationId : null,
            customerId: form.customer.id,
            destinationId: form.destination.id,
            driverId: form.driver ? form.driver.id : null,
            pickupPointId: form.pickupPoint.id,
            portId: form.port.id,
            shipId: form.ship ? form.ship.id : null,
            date: this.dateHelperService.formatDateToIso(new Date(this.form.value.date)),
            refNo: form.refNo,
            ticketNo: form.ticketNo,
            email: form.email,
            phones: form.phones,
            adults: form.adults,
            kids: form.kids,
            free: form.free,
            remarks: form.remarks,
            passengers: this.mapPassengers()
        }
        return reservation
    }

    private focusOnField(): void {
        this.helperService.focusOnField('')
    }

    private getLinkedCustomer(): void {
        if (ConnectedUser.isAdmin == false && this.isNewRecord) {
            const x = JSON.parse(this.sessionStorageService.getItem('customers'))
            const z = x.filter(x => x.id == ConnectedUser.customerId)
            this.form.patchValue({
                customer: {
                    'id': z.length > 0 ? z[0].id : 0,
                    'description': z.length > 0 ? z[0].description : ''
                }
            })
        }
    }

    private getValidPassengerIconForVoucher(isValid: boolean): string {
        if (isValid) {
            return this.okIconService.getIcon()
        } else {
            return this.warningIconService.getIcon()
        }
    }

    private getRecord(): Promise<any> {
        return new Promise((resolve) => {
            const formResolved: FormResolved = this.activatedRoute.snapshot.data['reservationForm']
            if (formResolved.error == null) {
                this.record = formResolved.record.body
                resolve(this.record)
            } else {
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
                this.goBack()
            }
        })
    }


    private getStoredDate(): void {
        if (this.sessionStorageService.getItem('date') != '') {
            const x = this.sessionStorageService.getItem('date')
            this.form.patchValue({
                'date': x
            })
        }
    }

    private getStoredDestination(): void {
        if (this.sessionStorageService.getItem('destination') != '') {
            const x = JSON.parse(this.sessionStorageService.getItem('destination'))
            this.form.patchValue({
                'destination': {
                    'id': x.id,
                    'description': x.description
                }
            })
        }
    }

    private goBack(): void {
        this.router.navigate([this.sessionStorageService.getItem('returnUrl')])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            reservationId: '',
            date: ['', [Validators.required]],
            refNo: '',
            destination: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            customer: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            pickupPoint: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            exactPoint: '',
            time: '',
            adults: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            kids: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            free: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            totalPax: ['0', ValidationService.isGreaterThanZero],
            driver: '',
            port: '',
            ship: '',
            ticketNo: ['', [Validators.required, Validators.maxLength(128)]],
            email: ['', [Validators.maxLength(128), Validators.email]],
            phones: ['', Validators.maxLength(128)],
            remarks: ['', Validators.maxLength(128)],
            imageBase64: '',
            passengers: [[]]
        })
    }

    private mapPassengers(): any {
        const form = this.form.value.passengers
        const passengers: PassengerWriteDto[] = []
        form.forEach((passenger: any) => {
            const x: PassengerWriteDto = {
                reservationId: passenger.reservationId,
                genderId: passenger.gender.id,
                nationalityId: passenger.nationality.id,
                occupantId: 2,
                lastname: passenger.lastname,
                firstname: passenger.firstname,
                birthdate: passenger.birthdate,
                specialCare: passenger.specialCare,
                remarks: passenger.remarks,
                isCheckedIn: passenger.isCheckedIn
            }
            passengers.push(x)
        })
        return passengers
    }

    private mapVoucherPassengers(): any {
        const passengers = []
        this.form.value.passengers.forEach((element: any) => {
            const passenger = {
                'lastname': element.lastname,
                'firstname': element.firstname
            }
            passengers.push(passenger)
        })
        return passengers
    }

    private populateDropdownFromStorage(table: string, filteredTable: string, formField: string, modelProperty: string): void {
        this[table] = JSON.parse(this.sessionStorageService.getItem(table))
        this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
    }

    private populateDropDowns(): void {
        this.populateDropdownFromStorage('customers', 'dropdownCustomers', 'customer', 'description')
        this.populateDropdownFromStorage('destinations', 'dropdownDestinations', 'destination', 'description')
        this.populateDropdownFromStorage('drivers', 'dropdownDrivers', 'driver', 'description')
        this.populateDropdownFromStorage('pickupPoints', 'dropdownPickupPoints', 'pickupPoint', 'description')
        this.populateDropdownFromStorage('ports', 'dropdownPorts', 'port', 'description')
        this.populateDropdownFromStorage('ships', 'dropdownShips', 'ship', 'description')
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
        this.reservationService.save(reservation).pipe(indicate(this.isLoading)).subscribe({
            next: (response) => {
                this.helperService.doPostSaveFormTasks('RefNo: ' + response.message, 'success', this.parentUrl, this.form)
                this.sessionStorageService.deleteItems([{ 'item': 'passengers', 'when': 'always' }])
            },
            error: (errorFromInterceptor) => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false, false)
                this.sessionStorageService.deleteItems([{ 'item': 'passengers', 'when': 'always' }])
            }
        })
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.sessionStorageService.getLanguage())
    }

    private setNewRecord(): void {
        this.isNewRecord = this.recordId == null
    }

    private setParentUrl(): void {
        this.parentUrl = '/reservations/date/' + this.sessionStorageService.getItem('date')
    }

    private setRecordId(): void {
        this.activatedRoute.params.subscribe(x => {
            this.recordId = x.id
        })
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.subscribe(() => {
            this.setLocale()
        })
    }

    private updateFieldsAfterEmptyPickupPoint(): void {
        this.form.get('pickupPoint').valueChanges.subscribe(value => {
            if (value == '') {
                this.form.patchValue({
                    exactPoint: '',
                    time: '',
                    port: ''
                })
            }
        })
    }

    private updateTabVisibility(): void {
        this.isReservationTabVisible = true
        this.isPassengersTabVisible = false
    }

    private validatePassengerCountForVoucher(reservationPax: any, passengerCount: any): boolean {
        return reservationPax == passengerCount.length ? true : false
    }

    //#endregion

    //#region getters

    get refNo(): AbstractControl {
        return this.form.get('refNo')
    }

    get date(): AbstractControl {
        return this.form.get('date')
    }

    get destination(): AbstractControl {
        return this.form.get('destination')
    }

    get customer(): AbstractControl {
        return this.form.get('customer')
    }

    get pickupPoint(): AbstractControl {
        return this.form.get('pickupPoint')
    }

    get ticketNo(): AbstractControl {
        return this.form.get('ticketNo')
    }

    get adults(): AbstractControl {
        return this.form.get('adults')
    }

    get kids(): AbstractControl {
        return this.form.get('kids')
    }

    get free(): AbstractControl {
        return this.form.get('free')
    }

    get totalPax(): AbstractControl {
        return this.form.get('totalPax')
    }

    get email(): AbstractControl {
        return this.form.get('email')
    }

    get phones(): AbstractControl {
        return this.form.get('phones')
    }

    get remarks(): AbstractControl {
        return this.form.get('remarks')
    }

    get driver(): AbstractControl {
        return this.form.get('driver')
    }

    get ship(): AbstractControl {
        return this.form.get('ship')
    }

    get port(): AbstractControl {
        return this.form.get('port')
    }

    //#endregion

}
