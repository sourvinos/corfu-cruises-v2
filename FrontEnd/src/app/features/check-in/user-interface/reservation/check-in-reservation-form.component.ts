import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject, Observable, Subject, map, startWith } from 'rxjs'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'
// Custom
import { CheckInService } from '../../classes/services/check-in.service'
import { ConnectedUser } from 'src/app/shared/classes/connected-user'
import { CustomerActiveVM } from '../../../customers/classes/view-models/customer-active-vm'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DestinationActiveVM } from 'src/app/features/destinations/classes/view-models/destination-active-vm'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { DriverActiveVM } from '../../../drivers/classes/view-models/driver-active-vm'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MatDialog } from '@angular/material/dialog'
import { MessageDialogService } from 'src/app/shared/services/message-dialog.service'
import { MessageInputHintService } from 'src/app/shared/services/message-input-hint.service'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { PickupPointDropdownVM } from 'src/app/features/pickupPoints/classes/view-models/pickupPoint-dropdown-vm'
import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'
import { ReservationHelperService } from 'src/app/features/reservations/classes/services/reservation.helper.service'
import { ReservationReadDto } from 'src/app/features/reservations/classes/dtos/form/reservation-read-dto'
import { ReservationWriteDto } from 'src/app/features/reservations/classes/dtos/form/reservation-write-dto'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { ValidationService } from './../../../../shared/services/validation.service'
import { VoucherService } from 'src/app/features/reservations/classes/voucher/services/voucher.service'

@Component({
    selector: 'check-in-reservation-form',
    templateUrl: './check-in-reservation-form.component.html',
    styleUrls: ['./check-in-reservation-form.component.css']
})

export class CheckInReservationFormComponent {

    //#region variables

    public record: ReservationReadDto
    private recordId: string
    public feature = 'checkInReservationForm'
    public featureIcon = 'check-in'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public isAutoCompleteDisabled = true
    public isLoading = new Subject<boolean>()
    public parentUrl = ''

    public arrowIcon = new BehaviorSubject('arrow_drop_down')
    public dropdownCustomers: Observable<CustomerActiveVM[]>
    public dropdownDestinations: Observable<DestinationActiveVM[]>
    public dropdownDrivers: Observable<DriverActiveVM[]>
    public dropdownPickupPoints: Observable<PickupPointDropdownVM[]>
    public dropdownPorts: Observable<PortActiveVM[]>
    public dropdownShips: Observable<DriverActiveVM[]>

    public isNewRecord: boolean
    public passengerDifferenceColor: string
    public isReservationTabVisible: boolean
    public isPassengersTabVisible: boolean
    public isMiscTabVisible: boolean

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private dialog: MatDialog, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageHintService: MessageInputHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageDialogService, private modalActionResultService: ModalActionResultService, private reservationHelperService: ReservationHelperService, private checkInService: CheckInService, private router: Router, private sessionStorageService: SessionStorageService, private voucherService: VoucherService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.setRecordId()
        this.setNewRecord()
        this.doNewOrEditTasks()
        this.doPostInitTasks()
        this.setTabTitle()
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

    public doVoucherTasksOnClient(): void {
        this.voucherService.createVoucherOnClient(this.reservationHelperService.createVoucher(this.form.value))
    }

    public doVoucherTasksOnServer(): void {
        this.modalActionResultService.open(this.messageSnackbarService.featureNotAvailable(), 'error', ['ok'])
    }

    public doTasksAfterPassengerFormIsClosed(passengers: any): void {
        this.patchFormWithPassengers(passengers)
        this.saveCachedReservation()
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

    public isReservationInStorage(): boolean {
        try {
            const x = JSON.parse(this.localStorageService.getItem('reservation'))
            if (this.isNewRecord == true && x.reservationId == '') {
                return true
            }
            if (this.isNewRecord == false && x.reservationId == this.record.reservationId) {
                return true
            }
        } catch (e) {
            return false
        }
    }

    public onSave(): void {
        this.saveRecord(this.flattenForm())
    }

    public openOrCloseAutoComplete(trigger: MatAutocompleteTrigger, element: any): void {
        this.helperService.openOrCloseAutocomplete(this.form, element, trigger)
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
        this.sessionStorageService.deleteItems([{ 'item': 'nationality', 'when': 'always' }])
    }

    private doNewOrEditTasks(): void {
        if (this.isNewRecord) {
            this.getStoredDate()
            this.getStoredDestination()
            this.getPassengerDifferenceColor()
        } else {
            this.getRecord()
            this.populateFields()
            this.getPassengerDifferenceColor()
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
        return this.reservationHelperService.flattenForm(this.form.value)
    }

    private focusOnField(): void {
        this.helperService.focusOnField()
    }

    private getLinkedCustomer(): void {
        const connectedCustomer = this.reservationHelperService.getLinkedCustomer(this.isNewRecord)
        if (connectedCustomer != undefined) {
            this.form.patchValue({
                customer: {
                    'id': connectedCustomer.length > 0 ? connectedCustomer[0].id : 0,
                    'description': connectedCustomer.length > 0 ? connectedCustomer[0].description : ''
                }
            })
        }
    }

    private getRecord(): void {
        this.record = JSON.parse(this.localStorageService.getItem('reservation'))
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
        const x = this.sessionStorageService.getItem('date')
        if (x != '') {
            this.router.navigate(['/reservations/date/' + x])
        } else {
            this.router.navigate(['/reservations'])
        }
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            reservationId: '',
            date: ['', [Validators.required]],
            refNo: '',
            destination: [''],
            customer: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            pickupPoint: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            exactPoint: '',
            time: '',
            adults: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            kids: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            free: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            totalPax: [0, ValidationService.isGreaterThanZero],
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

    private patchFormWithPassengers(passengers: any): void {
        this.form.patchValue({ passengers: passengers })
    }

    private populateDropdownFromStorage(table: string, filteredTable: string, formField: string, modelProperty: string): void {
        this[table] = JSON.parse(this.sessionStorageService.getItem(table))
        this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
    }

    private populateDropDowns(): void {
        // this.populateDropdownFromStorage('customers', 'dropdownCustomers', 'customer', 'description')
        this.populateDropdownFromStorage('destinations', 'dropdownDestinations', 'destination', 'description')
        // this.populateDropdownFromStorage('drivers', 'dropdownDrivers', 'driver', 'description')
        // this.populateDropdownFromStorage('pickupPoints', 'dropdownPickupPoints', 'pickupPoint', 'description')
        // this.populateDropdownFromStorage('ports', 'dropdownPorts', 'port', 'description')
        // this.populateDropdownFromStorage('ships', 'dropdownShips', 'ship', 'description')
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
        this.checkInService.save(reservation).subscribe({
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

    private saveCachedReservation(): void {
        this.localStorageService.saveItem('reservation', JSON.stringify(this.reservationHelperService.createCachedReservation(this.form.value)))
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private setNewRecord(): void {
        this.isNewRecord = this.recordId == null
    }

    private setParentUrl(): void {
        if (this.sessionStorageService.getItem('returnUrl') == '/reservations') {
            if (this.sessionStorageService.getItem('date') != '') {
                this.parentUrl = '/reservations/date/' + this.sessionStorageService.getItem('date')
            } else {
                this.parentUrl = '/reservations'
            }
        }
        if (this.sessionStorageService.getItem('returnUrl') == '/availability') {
            this.parentUrl = '/availability'
        }
    }

    private setRecordId(): void {
        this.activatedRoute.params.subscribe(x => {
            this.recordId = x.id
        })
    }

    private setTabTitle(): void {
        this.helperService.setTabTitle(this.feature)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.subscribe(() => {
            this.setLocale()
        })
        this.interactionService.refreshTabTitle.subscribe(() => {
            this.setTabTitle()
        })
    }

    private updateTabVisibility(): void {
        this.isReservationTabVisible = true
        this.isPassengersTabVisible = false
    }

    //#endregion

}
