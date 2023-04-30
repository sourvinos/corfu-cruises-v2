import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms'
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
import { ReservationWriteDto } from 'src/app/features/reservations/classes/dtos/form/reservation-write-dto'
import { ReservationHelperService } from 'src/app/features/reservations/classes/services/reservation.helper.service'
import { MatStepper } from '@angular/material/stepper'
import { EmojiService } from 'src/app/shared/services/emoji.service'

@Component({
    selector: 'check-in-criteria',
    templateUrl: './check-in-criteria.component.html',
    styleUrls: ['./check-in-criteria.component.css']
})

export class CheckInCriteriaComponent {

    //#region variables

    private unsubscribe = new Subject<void>()
    public feature = 'checkIn'
    public featureIcon = 'check-in'
    public searchForm: FormGroup
    public reservationForm: FormGroup
    public icon = 'home'
    public parentUrl = '/home'

    public isLoading = new Subject<boolean>()
    public selected: Date | null
    public destinations: SimpleEntity[] = []
    public options: any[] = [
        { 'id': 1, 'description': this.getLabel('step-1-yes') },
        { 'id': 2, 'description': this.getLabel('step-1-no') }
    ]
    public isEmailSent = true

    //#endregion

    constructor(
        private reservationHelperService: ReservationHelperService,
        private checkInService: CheckInService,
        private dateAdapter: DateAdapter<any>,
        private dateHelperService: DateHelperService,
        private dialogService: DialogService,
        private formBuilder: FormBuilder,
        private helperService: HelperService,
        private interactionService: InteractionService,
        private localStorageService: LocalStorageService,
        private messageHintService: MessageInputHintService,
        private messageLabelService: MessageLabelService,
        private messageSnackbarService: MessageDialogService,
        private router: Router,
        private sessionStorageService: SessionStorageService,
        private emojiService: EmojiService
    ) { }

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

    public doSearch(stepper: MatStepper): void {
        if (this.searchForm.value.selection == 1) {
            this.searchByRefNo().then((response) => {
                response == true ? stepper.next() : null
            })
        }
        if (this.searchForm.value.selection == 2) {
            this.searchByDate().then((response) => {
                response == true ? stepper.next() : null
            })
        }
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public gotoIntroForm(): void {
        this.router.navigate(['/'])
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

    public requiredFieldsShouldBeGiven(): boolean {
        if (this.searchForm.value.selection == '') {
            return true
        }
        if (this.searchForm.value.selection == 1) {
            return this.searchForm.value.refNo == ''
        }
        if (this.searchForm.value.selection == 2) {
            return (this.searchForm.value.complexGroup.date == '' || this.searchForm.value.complexGroup.destination == '' || this.searchForm.value.complexGroup.lastname == '' || this.searchForm.value.complexGroup.firstname == '')
        }
    }

    public searchByRefNo(): Promise<any> {
        return new Promise((resolve) => {
            this.checkInService.getByRefNo(this.searchForm.value.refNo).pipe(indicate(this.isLoading)).subscribe({
                next: (x) => {
                    this.patchReservationForm(x.body)
                    resolve(true)
                },
                error: (errorFromInterceptor) => {
                    this.showError(errorFromInterceptor)
                    resolve(false)
                }
            })
            return false
        })
    }

    public searchByDate(): Promise<any> {
        return new Promise((resolve) => {
            this.checkInService.getByDate(this.searchForm.value.complexGroup.date, this.searchForm.value.complexGroup.destination, this.searchForm.value.complexGroup.lastname, this.searchForm.value.complexGroup.firstname).pipe(indicate(this.isLoading)).subscribe({
                next: (x) => {
                    this.patchReservationForm(x.body)
                    resolve(true)
                },
                error: (errorFromInterceptor) => {
                    this.showError(errorFromInterceptor)
                    resolve(false)
                }
            })
            return false
        })
    }

    public showHelpDialog(): void {
        this.dialogService.open(this.messageSnackbarService.helpDialog(), 'info', ['ok'])
    }

    public onSendEmail(stepper: MatStepper): void {
        this.reservationForm.patchValue({
            email: this.searchForm.value.email
        })
        this.checkInService.sendEmail(this.reservationForm.value).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                stepper.next()
            },
            error: () => {
                this.isEmailSent = false
            }
        })
    }

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private flattenForm(): ReservationWriteDto {
        return this.reservationHelperService.flattenForm(this.reservationForm.value)
    }

    private getToday(): string {
        return (this.dateHelperService.formatDateToIso(new Date()))
    }

    private initSearchForm(): void {
        this.searchForm = this.formBuilder.group({
            selection: '',
            refNo: '',
            complexGroup: this.formBuilder.group({
                date: [this.getToday()],
                destination: [''],
                lastname: [''],
                firstname: ['']
            }),
            email: ['', [Validators.required, Validators.email]]
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
            this.saveReservation(this.flattenForm())
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
            port: reservation.pickupPoint.port,
            ship: reservation.ship,
            phones: reservation.phones,
            email: reservation.email,
            remarks: reservation.remarks,
            passengers: reservation.passengers,
        })
        this.searchForm.patchValue({
            email: reservation.email
        })
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

    private showError(error: any): void {
        switch (error.status) {
            case 402:
                this.dialogService.open(this.messageSnackbarService.checkInAfterDepartureIsNotAllowed(), 'error', ['ok'])
                break
            case 404:
                this.dialogService.open(this.messageSnackbarService.reservationNotFound(), 'error', ['ok'])
                break
        }
    }

    //#endregion

    //#region getters

    get refNo(): AbstractControl {
        return this.searchForm.get('refNo')
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

    get email(): AbstractControl {
        return this.searchForm.get('email')
    }

    //#endregion

}
