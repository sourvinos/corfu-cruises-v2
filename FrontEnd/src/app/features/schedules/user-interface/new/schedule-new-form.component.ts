import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { DateRange } from '@angular/material/datepicker'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Subject, Subscription } from 'rxjs'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { FieldsetCriteriaService } from 'src/app/shared/services/fieldset-criteria.service'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { ScheduleService } from '../../classes/services/schedule.service'
import { ScheduleWriteVM } from '../../classes/form/schedule-write-vm'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'
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

    public destinations: SimpleEntity[]
    public ports: SimpleEntity[]
    public weekdays: any[]

    public selectedFromDate = new Date()
    public selectedRangeValue: DateRange<Date>
    public selectedToDate = new Date()

    private daysToCreate = []

    //#endregion

    constructor(private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private emojiService: EmojiService, private fieldsetCriteriaService: FieldsetCriteriaService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private scheduleService: ScheduleService, private sessionStorageService: SessionStorageService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateDropdowns()
        this.populateWeekdays()
        this.setSelectedDates()
        this.setLocale()
        this.subscribeToInteractionService()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public filterList(event: { target: { value: any } }, list: string | number): void {
        this.fieldsetCriteriaService.filterList(event.target.value, this[list])
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

    public gotoToday(): void {
        this.form.patchValue({
            fromDate: this.dateHelperService.formatDateToIso(new Date()),
            toDate: this.dateHelperService.formatDateToIso(new Date())
        })
    }

    public onSave(): void {
        this.saveRecord()
    }

    public patchFormWithSelectedDates(fromDate: any, toDate: any): void {
        this.form.patchValue({
            fromDate: fromDate.value != null ? this.dateHelperService.formatDateToIso(new Date(fromDate.value)) : '',
            toDate: toDate.value != null ? this.dateHelperService.formatDateToIso(new Date(toDate.value)) : ''
        })
        this.createPeriod()
        this.updateFormField()
    }

    public toggleAllCheckboxes(form: FormGroup, array: string, allCheckboxes: string): void {
        this.fieldsetCriteriaService.toggleAllCheckboxes(form, array, allCheckboxes)
    }

    public updateRadioButtons(form: FormGroup, classname: any, idName: any, id: any, description: any): void {
        this.fieldsetCriteriaService.updateRadioButtons(form, classname, idName, id, description)
    }

    public checkboxChange(event: any, allCheckbox: string, formControlsArray: string, array: any[], description: string): void {
        this.updateWeekdayCheckbox(event, allCheckbox, formControlsArray, array, description)
        this.createPeriod()
        this.updateFormField()
    }

    //#endregion

    //#region private methods

    private buildScheduleToCreate(): ScheduleWriteVM[] {
        const formValue = this.form.value
        const objects: ScheduleWriteVM[] = []
        this.form.value.daysToInsert.forEach((day: any) => {
            const x: ScheduleWriteVM = {
                id: formValue.id,
                destinationId: formValue.destinations[0].id,
                portId: formValue.ports[0].id,
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

    private buildPeriod(from: Date, to: Date): any {
        const dateArray = []
        const currentDate = from
        while (currentDate <= to) {
            dateArray.push(this.dateHelperService.formatDateToIso(currentDate, true))
            currentDate.setDate(currentDate.getDate() + 1)
        }
        return dateArray
    }

    private createPeriod(): void {
        this.daysToCreate = []
        if (this.fromDate.valid && this.toDate.valid && this.form.value.weekdays.length != 0) {
            const period = this.buildPeriod(new Date(this.fromDate.value), new Date(this.toDate.value))
            period.forEach((day: string) => {
                this.form.value.weekdays.forEach((weekday: { description: string }) => {
                    if (day.substring(0, 3) == weekday.description.substring(0, 3)) {
                        this.daysToCreate.push(day.substring(4))
                    }
                })
            })
        }
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            destinations: this.formBuilder.array([], Validators.required),
            ports: this.formBuilder.array([], Validators.required),
            weekdays: this.formBuilder.array([], Validators.required),
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required],
            daysToInsert: ['', Validators.required],
            maxPax: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
            time: ['00:00', [Validators.required, ValidationService.isTime]],
            destinationsFilter: '',
            allDestinationsCheckbox: '',
            portsFilter: '',
            allPortsCheckbox: '',
            weekdaysFilter: '',
            allWeekdaysCheckbox: ''
        })
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.sessionStorageService.getItem(table))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('destinations')
        this.populateDropdownFromLocalStorage('ports')
    }

    private populateWeekdays(): void {
        this.weekdays = [
            { id: '0', description: this.messageCalendarService.getDescription('weekdays', '0') },
            { id: '1', description: this.messageCalendarService.getDescription('weekdays', '1') },
            { id: '2', description: this.messageCalendarService.getDescription('weekdays', '2') },
            { id: '3', description: this.messageCalendarService.getDescription('weekdays', '3') },
            { id: '4', description: this.messageCalendarService.getDescription('weekdays', '4') },
            { id: '5', description: this.messageCalendarService.getDescription('weekdays', '5') },
            { id: '6', description: this.messageCalendarService.getDescription('weekdays', '6') }
        ]
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

    private setSelectedDates(): void {
        this.selectedRangeValue = new DateRange(new Date(), new Date())
        this.form.patchValue({
            fromDate: this.dateHelperService.formatDateToIso(new Date(), false),
            toDate: this.dateHelperService.formatDateToIso(new Date(), false),
        })
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

    private updateWeekdayCheckbox(event: any, allCheckbox: string, formControlsArray: string, array: any[], description: string): void {
        this.fieldsetCriteriaService.checkboxChange(this.form, event, allCheckbox, formControlsArray, array, description)
    }

    //#endregion

    //#region getters

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
