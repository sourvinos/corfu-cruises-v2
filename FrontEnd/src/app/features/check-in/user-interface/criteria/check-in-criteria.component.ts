import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { FieldsetCriteriaService } from 'src/app/shared/services/fieldset-criteria.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import { MessageInputHintService } from 'src/app/shared/services/message-input-hint.service'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'
import { CheckInCriteriaVM } from '../../classes/view-models/criteria/check-in-criteria-vm'
import { CheckInService } from '../../classes/services/check-in.service'

@Component({
    selector: 'check-in-criteria',
    templateUrl: './check-in-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './check-in-criteria.component.css']
})

export class CheckInCriteriaComponent {

    //#region variables

    private unsubscribe = new Subject<void>()
    public feature = 'checkInCriteria'
    public featureIcon = 'check-in'
    public form: FormGroup
    public icon = 'home'
    public parentUrl = '/home'

    public selected: Date | null
    private criteria: CheckInCriteriaVM

    public destinations: SimpleEntity[] = []

    //#endregion

    constructor(
        private dateAdapter: DateAdapter<any>,
        private dateHelperService: DateHelperService,
        private checkInService: CheckInService,
        private emojiService: EmojiService,
        private fieldsetCriteriaService: FieldsetCriteriaService,
        private formBuilder: FormBuilder,
        private helperService: HelperService,
        private interactionService: InteractionService,
        private localStorageService: LocalStorageService,
        private messageHintService: MessageInputHintService,
        private messageLabelService: MessageLabelService,
        private router: Router,
        private sessionStorageService: SessionStorageService
    ) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateDropdowns()
        this.setLocale()
        this.subscribeToInteractionService()
        this.setTabTitle()
    }

    ngDoCheck(): void {
        if (this.selected) {
            this.form.patchValue({
                date: this.dateHelperService.formatDateToIso(new Date(this.selected))
            })
        }
    }

    ngAfterViewInit(): void {
        // this.enableFilters()
        // this.checkGroupCheckbox('all-destinations', this.destinations, 'destinations')
        // this.checkGroupCheckbox('all-ports', this.ports, 'ports')
        // this.checkGroupCheckbox('all-ships', this.ships, 'ships')
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public doTasks(): void {
        this.search()
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public patchFormWithSelectedDate(event: MatDatepickerInputEvent<Date>): void {
        this.form.patchValue({
            date: this.dateHelperService.formatDateToIso(new Date(event.value))
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

    private initForm(): void {
        this.form = this.formBuilder.group({
            refNo: '',
            ticketNo: '',
            date: [this.getToday(), Validators.required],
            destination: ['', Validators.required],
            lastname: ['', Validators.required],
            firstname: ['', Validators.required]
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

    private search(): void {
        this.checkInService.get(
            this.form.value.refNo).subscribe(response => {
                console.log(response)
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

    get date(): AbstractControl {
        return this.form.get('date')
    }

    get lastname(): AbstractControl {
        return this.form.get('lastname')
    }

    get firstname(): AbstractControl {
        return this.form.get('firstname')
    }

    //#endregion

}
