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
    public form: FormGroup
    public icon = 'home'
    public parentUrl = '/home'

    public isLoading = new Subject<boolean>()
    public selected: Date | null
    public destinations: SimpleEntity[] = []

    //#endregion

    constructor(private checkInService: CheckInService, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageHintService: MessageInputHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageDialogService, private router: Router, private sessionStorageService: SessionStorageService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
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

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public patchFormWithSelectedDate(event: MatDatepickerInputEvent<Date>): void {
        this.form.patchValue({
            complexGroup: {
                date: this.dateHelperService.formatDateToIso(new Date(event.value))
            }
        })
    }

    public searchByRefNo(): void {
        this.checkInService.getByRefNo(this.form.value.refNo).pipe(indicate(this.isLoading)).subscribe({
            next: (x) => {
                this.localStorageService.saveItem('reservation', JSON.stringify(x.body))
                this.dialogService.open(this.messageSnackbarService.reservationFound(), 'info', 'center-buttons', ['ok']).subscribe(() => {
                    this.router.navigate(['check-in/', x.body.reservationId])
                })
            },
            error: () => {
                this.dialogService.open(this.messageSnackbarService.reservationNotFound(), 'error', 'center-buttons', ['ok'])
            }
        })
    }

    public searchByTicketNo(): void {
        this.checkInService.getByTicketNo(this.form.value.ticketNo).pipe(indicate(this.isLoading)).subscribe({
            next: (x) => {
                this.localStorageService.saveItem('reservation', JSON.stringify(x.body))
                this.dialogService.open(this.messageSnackbarService.reservationFound(), 'info', 'center-buttons', ['ok']).subscribe(() => {
                    this.router.navigate(['check-in/', x.body.reservationId])
                })
            },
            error: () => {
                this.dialogService.open(this.messageSnackbarService.reservationNotFound(), 'error', 'center-buttons', ['ok'])
            }
        })
    }

    public searchByDate(): void {
        this.checkInService.getByDate(this.form.value.complexGroup.date, this.form.value.complexGroup.destination, this.form.value.complexGroup.lastname, this.form.value.complexGroup.firstname).subscribe({
            complete: () => {
                this.dialogService.open(this.messageSnackbarService.reservationFound(), 'info', 'center-buttons', ['ok'])
            },
            error: () => {
                this.dialogService.open(this.messageSnackbarService.reservationNotFound(), 'error', 'center-buttons', ['ok'])
            }
        })
    }

    public showHelpDialog(): void {
        this.dialogService.open(this.messageSnackbarService.helpDialog(), 'info', 'center-buttons', ['ok'])
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

    private initForm(): void {
        this.form = this.formBuilder.group({
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
    }

    //#endregion

    //#region getters

    get refNo(): AbstractControl {
        return this.form.get('refNo')
    }

    get ticketNo(): AbstractControl {
        return this.form.get('ticketNo')
    }

    get complexGroup(): AbstractControl {
        return this.form.get('complexGroup')
    }

    get date(): AbstractControl {
        return this.form.get('complexGroup.date')
    }

    get destination(): AbstractControl {
        return this.form.get('complexGroup.destination')
    }

    get lastname(): AbstractControl {
        return this.form.get('complexGroup.lastname')
    }

    get firstname(): AbstractControl {
        return this.form.get('complexGroup.firstname')
    }

    //#endregion

}
