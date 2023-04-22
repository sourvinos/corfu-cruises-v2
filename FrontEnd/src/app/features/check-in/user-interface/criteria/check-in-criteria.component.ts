import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { CheckInService } from '../../classes/services/check-in.service'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageDialogService } from 'src/app/shared/services/message-dialog.service'
import { MessageInputHintService } from 'src/app/shared/services/message-input-hint.service'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'
import { CheckInReservationVM } from '../../classes/view-models/list/check-in-reservation-vm'
import { ReservationWriteDto } from 'src/app/features/reservations/classes/dtos/form/reservation-write-dto'

@Component({
    selector: 'check-in-criteria',
    templateUrl: './check-in-criteria.component.html',
    styleUrls: ['./check-in-criteria.component.css']
})

export class CheckInCriteriaComponent {

    //#region variables

    private unsubscribe = new Subject<void>()
    public feature = 'checkInCriteria'
    public featureIcon = 'check-in'
    public searchForm: FormGroup
    public reservationForm: FormGroup
    public icon = 'home'
    public parentUrl = '/home'

    public isLoading = new Subject<boolean>()
    public selected: Date | null
    public destinations: SimpleEntity[] = []
    public options: string[] = ['Yes', 'No']
    private reservation: CheckInReservationVM

    //#endregion

    constructor(private checkInService: CheckInService, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageHintService: MessageInputHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageDialogService, private router: Router, private sessionStorageService: SessionStorageService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initSearchForm()
        this.initReservationForm()
        this.populateDropdowns()
        this.setLocale()
        this.subscribeToInteractionService()
        this.setTabTitle()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public doSearch(): void {
        if (this.searchForm.value.selection == 'Yes') {
            this.searchByRefNo()
        } else {
            this.searchByDate()
        }
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public formatISODateToLocale(): string {
        if (this.reservationForm.value.date != '') {
            return this.dateHelperService.formatISODateToLocale(this.reservationForm.value.date)
        }
    }

    public patchFormWithSelectedDate(event: MatDatepickerInputEvent<Date>): void {
        this.searchForm.patchValue({
            complexGroup: {
                date: this.dateHelperService.formatDateToIso(new Date(event.value))
            }
        })
    }

    public searchByRefNo(): void {
        this.checkInService.getByRefNo(this.searchForm.value.refNo).pipe(indicate(this.isLoading)).subscribe({
            next: (x) => {
                this.patchReservationForm(x.body)
            },
            error: () => {
                alert('NOT Found')
            }
        })
    }

    public searchByDate(): void {
        this.checkInService.getByDate(this.searchForm.value.complexGroup.date, this.searchForm.value.complexGroup.destination, this.searchForm.value.complexGroup.lastname, this.searchForm.value.complexGroup.firstname).pipe(indicate(this.isLoading)).subscribe({
            next: (x) => {
                this.patchReservationForm(x.body)
            },
            error: () => {
                alert('NOT Found')
            }
        })
    }

    public showHelpDialog(): void {
        this.dialogService.open(this.messageSnackbarService.helpDialog(), 'info', 'center-buttons', ['ok'])
    }

    public onSendEmail(): void {
        this.checkInService.sendEmail(this.reservationForm.value).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.emailSent(), 'success', '', this.reservationForm, false, false)
            },
            error: () => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.emailNotSent(), 'error', '', this.reservationForm)
            }
        })
    }

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private getToday(): string {
        return (this.dateHelperService.formatDateToIso(new Date()))
    }

    private initSearchForm(): void {
        this.searchForm = this.formBuilder.group({
            selection: '',
            refNo: '',
            ticketNo: '',
            complexGroup: this.formBuilder.group({
                date: [this.getToday(), Validators.required],
                destination: ['', Validators.required],
                lastname: ['', Validators.required],
                firstname: ['', Validators.required]
            })
        })
    }

    private initReservationForm(): void {
        this.reservationForm = this.formBuilder.group({
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

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.sessionStorageService.getItem(table))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('destinations')
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private setTabTitle(): void {
        this.helperService.setTabTitle(this.feature)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
        this.interactionService.refreshTabTitle.subscribe(() => {
            this.setTabTitle()
        })
        this.interactionService.saveReservation.subscribe(() => {
            this.saveReservation(this.reservationForm.value)
        })
    }

    private patchReservationForm(reservation): void {
        this.reservationForm.patchValue({
            reservationId: reservation.reservationId,
            refNo: reservation.refNo,
            date: reservation.date,
            ticketNo: reservation.ticketNo,
            destination: reservation.destination,
            customer: reservation.customer,
            pickupPoint: reservation.pickupPoint,
            adults: reservation.adults,
            kids: reservation.kids,
            free: reservation.free,
            totalPax: reservation.totalPax,
            driver: reservation.driver,
            port: reservation.port,
            ship: reservation.ship,
            phones: reservation.phones,
            email: reservation.email,
            remarks: reservation.remarks,
            passengers: reservation.passengers,
        })
    }

    private patchFormWithPassengers(passengers: any): void {
        this.reservationForm.patchValue({ passengers: passengers })
    }

    private saveReservation(reservation: ReservationWriteDto): void {
        this.checkInService.save(reservation).pipe(indicate(this.isLoading)).subscribe({
            next: () => {
                console.log('Saved')
            },
            error: (errorFromInterceptor) => {
                console.log('Not saved', errorFromInterceptor)
            }
        })
    }

    //#endregion

    //#region getters

    get refNo(): AbstractControl {
        return this.searchForm.get('refNo')
    }

    get ticketNo(): AbstractControl {
        return this.searchForm.get('ticketNo')
    }

    get complexGroup(): AbstractControl {
        return this.searchForm.get('complexGroup')
    }

    get date(): AbstractControl {
        return this.searchForm.get('complexGroup.date')
    }

    get destination(): AbstractControl {
        return this.searchForm.get('complexGroup.destination')
    }

    get lastname(): AbstractControl {
        return this.searchForm.get('complexGroup.lastname')
    }

    get firstname(): AbstractControl {
        return this.searchForm.get('complexGroup.firstname')
    }

    //#endregion

}
