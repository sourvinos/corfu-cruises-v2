import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject, Subscription } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
// Custom
import { DestinationActiveVM } from 'src/app/features/destinations/classes/view-models/destination-active-vm'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'
import { ScheduleReadDto } from '../../classes/form/schedule-read-vm'
import { ScheduleService } from '../../classes/services/schedule.service'
import { ScheduleWriteVM } from '../../classes/form/schedule-write-vm'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
    selector: 'schedule-edit',
    templateUrl: './schedule-edit-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './schedule-edit-form.component.css']
})

export class ScheduleEditFormComponent {

    //#region variables

    private record: ScheduleReadDto
    private recordId: number
    private subscription = new Subscription()
    public feature = 'scheduleEditForm'
    public featureIcon = 'schedules'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public isAutoCompleteDisabled = true
    public isLoading = new Subject<boolean>()
    public isNewRecord: boolean
    public parentUrl = '/schedules'

    public dropdownDestinations: Observable<DestinationActiveVM[]>
    public dropdownPorts: Observable<PortActiveVM[]>

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private scheduleService: ScheduleService, private sessionStorageService: SessionStorageService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.setRecordId()
        this.setNewRecord()
        this.getRecord()
        this.populateFields()
        this.populateDropdowns()
        this.subscribeToInteractionService()
        this.setLocale()
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

    public enableOrDisableAutoComplete(event: any): void {
        this.isAutoCompleteDisabled = this.helperService.enableOrDisableAutoComplete(event)
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onDelete(): void {
        this.dialogService.open(this.messageSnackbarService.warning(), 'warning', 'right-buttons', ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.scheduleService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
                    complete: () => {
                        this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
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

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.subscription.unsubscribe()
    }

    private filterAutocomplete(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): ScheduleWriteVM {
        const schedule = {
            id: this.form.value.id,
            date: this.form.value.date,
            destinationId: this.form.value.destination.id,
            portId: this.form.value.port.id,
            maxPax: this.form.value.maxPax,
            time: this.form.value.time,
            isActive: this.form.value.isActive
        }
        return schedule
    }

    private focusOnField(): void {
        this.helperService.focusOnField('')
    }

    private getRecord(): Promise<any> {
        const promise = new Promise((resolve) => {
            const formResolved: FormResolved = this.activatedRoute.snapshot.data['scheduleEditForm']
            if (formResolved.error == null) {
                this.record = formResolved.record.body
                resolve(this.record)
            } else {
                this.goBack()
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
            }
        })
        return promise
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            date: ['', [Validators.required, Validators.maxLength(10)]],
            destination: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            port: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            maxPax: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            time: ['', [Validators.required, ValidationService.isTime]],
            isActive: true
        })
    }

    private populateDropdownFromStorage(table: string, filteredTable: string, formField: string, modelProperty: string): void {
        this[table] = JSON.parse(this.sessionStorageService.getItem(table))
        this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromStorage('destinations', 'dropdownDestinations', 'destination', 'description')
        this.populateDropdownFromStorage('ports', 'dropdownPorts', 'port', 'description')
    }

    private populateFields(): void {
        if (this.isNewRecord == false) {
            this.form.setValue({
                id: this.record.id,
                date: this.record.date,
                destination: { 'id': this.record.destination.id, 'description': this.record.destination.description },
                port: { 'id': this.record.port.id, 'description': this.record.port.description },
                maxPax: this.record.maxPax,
                time: this.record.time,
                isActive: this.record.isActive
            })
        }
    }

    private saveRecord(schedule: ScheduleWriteVM): void {
        this.scheduleService.save(schedule).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
            },
            error: (errorFromInterceptor) => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false)
            }
        })
    }

    private setNewRecord(): void {
        this.isNewRecord = this.recordId == null
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.sessionStorageService.getLanguage())
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

    //#endregion

    //#region getters

    get date(): AbstractControl {
        return this.form.get('date')
    }

    get destination(): AbstractControl {
        return this.form.get('destination')
    }

    get port(): AbstractControl {
        return this.form.get('port')
    }

    get maxPax(): AbstractControl {
        return this.form.get('maxPax')
    }

    get time(): AbstractControl {
        return this.form.get('time')
    }

    //#endregion

}
