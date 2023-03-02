import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject, Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { map, startWith } from 'rxjs/operators'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DestinationActiveVM } from 'src/app/features/destinations/classes/view-models/destination-active-vm'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'
import { ScheduleService } from '../../classes/services/schedule.service'
import { ScheduleWriteVM } from '../../classes/form/schedule-write-vm'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
    selector: 'schedule-new',
    templateUrl: './schedule-new-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './schedule-new-form.component.css']
})

export class ScheduleNewFormComponent {

    //#region variables

    private subscription = new Subscription()
    public feature = 'scheduleCreateForm'
    public featureIcon = 'schedules'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public isAutoCompleteDisabled = true
    public isLoading = new Subject<boolean>()
    public parentUrl = '/schedules'

    public dropdownDestinations: Observable<DestinationActiveVM[]>
    public dropdownPorts: Observable<PortActiveVM[]>

    public toggledClassName = 'active-selectable-day'
    private daysToCreate = []
    public selectedWeekdays = []
    public weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    //#endregion

    constructor(private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private scheduleService: ScheduleService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
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

    public getWeekday(id: string): string {
        return this.messageCalendarService.getDescription('weekdays', id)
    }

    public onDoPeriodTasks(selectedWeekDay: string, selectedWeekdays: string[], toggledClassName: string): void {
        this.buildSelectedWeekdays(selectedWeekDay, selectedWeekdays, toggledClassName)
        this.createPeriod()
        this.updateFormField()
    }

    public onSave(): void {
        this.saveRecord()
    }

    public createPeriod(): void {
        this.daysToCreate = []
        if (this.fromDate.valid && this.toDate.valid) {
            const period = this.buildPeriod(new Date(this.fromDate.value), new Date(this.toDate.value))
            period.forEach((day: string) => {
                if (this.selectedWeekdays.length != 0) {
                    this.selectedWeekdays.forEach(weekday => {
                        if (day.substring(0, 3) == weekday) {
                            this.daysToCreate.push(day.substring(4))
                        }
                    })
                }
            })
        }
    }

    //#endregion

    //#region private methods

    private buildScheduleToCreate(): ScheduleWriteVM[] {
        const formValue = this.form.value
        const objects: ScheduleWriteVM[] = []
        this.form.value.daysToInsert.forEach((day: any) => {
            const x: ScheduleWriteVM = {
                id: formValue.id,
                destinationId: formValue.destination.id,
                portId: formValue.port.id,
                date: day,
                maxPax: formValue.maxPax,
                time: formValue.time,
                isActive: true
            }
            objects.push(x)
        })
        return objects
    }

    private cleanup(): void {
        this.subscription.unsubscribe()
    }

    private buildSelectedWeekdays(item: string, lookupArray: string[], className: string): void {
        this.helperService.toggleActiveItem(item, lookupArray, className)
    }

    private buildPeriod(from: Date, to: Date): any {
        const dateArray = []
        const currentDate = from
        while (currentDate <= to) {
            dateArray.push(this.dateHelperService.formatDateToIso(currentDate, true))
            currentDate.setDate(currentDate.getDate() + 1)
        }
        return dateArray
    }

    private filterAutocomplete(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private focusOnField(): void {
        this.helperService.focusOnField('')
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            destination: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            port: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required],
            daysToInsert: ['', Validators.required],
            maxPax: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            time: ['', [Validators.required, ValidationService.isTime]]
        })
    }

    private populateDropdownFromStorage(table: string, filteredTable: string, formField: string, modelProperty: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
        this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromStorage('destinations', 'dropdownDestinations', 'destination', 'description')
        this.populateDropdownFromStorage('ports', 'dropdownPorts', 'port', 'description')
    }

    private saveRecord(): void {
        this.scheduleService.addRange(this.buildScheduleToCreate()).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
            },
            error: (errorFromInterceptor) => {
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', ['ok'])
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

    private updateFormField(): void {
        this.form.patchValue({
            daysToInsert: this.daysToCreate
        })
    }

    //#endregion

    //#region getters

    get destination(): AbstractControl {
        return this.form.get('destination')
    }

    get port(): AbstractControl {
        return this.form.get('port')
    }

    get fromDate(): AbstractControl {
        return this.form.get('fromDate')
    }

    get toDate(): AbstractControl {
        return this.form.get('toDate')
    }

    get maxPax(): AbstractControl {
        return this.form.get('maxPax')
    }

    get time(): AbstractControl {
        return this.form.get('time')
    }

    //#endregion

}
