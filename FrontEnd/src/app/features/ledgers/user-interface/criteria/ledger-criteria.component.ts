import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { DateRange, MatCalendar } from '@angular/material/datepicker'
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { ConnectedUser } from 'src/app/shared/classes/connected-user'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { EmojiService } from './../../../../shared/services/emoji.service'
import { FieldsetCriteriaService } from 'src/app/shared/services/fieldset-criteria.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LedgerCriteriaVM } from '../../classes/view-models/criteria/ledger-criteria-vm'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { SimpleEntity } from './../../../../shared/classes/simple-entity'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'

@Component({
    selector: 'ledger-criteria',
    templateUrl: './ledger-criteria.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './ledger-criteria.component.css']
})

export class LedgerCriteriaComponent {

    //#region variables

    @ViewChild('calendar', { static: false }) calendar: MatCalendar<Date>

    private unsubscribe = new Subject<void>()
    public feature = 'ledgerCriteria'
    public featureIcon = 'ledgers'
    public form: FormGroup
    public icon = 'home'
    public parentUrl = null

    private criteria: LedgerCriteriaVM
    public selectedFromDate = new Date()
    public selectedRangeValue: DateRange<Date>
    public selectedToDate = new Date()
    public customers: SimpleEntity[] = []
    public destinations: SimpleEntity[] = []
    public ships: SimpleEntity[] = []

    public isAdmin = false

    //#endregion

    constructor(private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private emojiService: EmojiService, private fieldsetCriteriaService: FieldsetCriteriaService, private formBuilder: FormBuilder, private messageHintService: MessageHintService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateDropdowns()
        this.getConnectedUserRole()
        this.doSimpleUserTasks()
        this.populateFieldsFromStoredVariables()
        this.setSelectedDates()
        this.setLocale()
        this.subscribeToInteractionService()
    }

    ngAfterViewInit(): void {
        this.checkGroupCheckbox('all-customers', this.customers, 'customers')
        this.checkGroupCheckbox('all-destinations', this.destinations, 'destinations')
        this.checkGroupCheckbox('all-ships', this.ships, 'ships')
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public checkboxChange(event: any, allCheckbox: string, formControlsArray: string, array: any[], description: string): void {
        this.fieldsetCriteriaService.checkboxChange(this.form, event, allCheckbox, formControlsArray, array, description)
    }

    public doTasks(): void {
        this.storeCriteria()
        this.navigateToList()
    }

    public filterList(event: { target: { value: any } }, list: string | number): void {
        this.fieldsetCriteriaService.filterList(event.target.value, this[list])
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

    public gotoToday(): void {
        this.form.patchValue({
            fromDate: this.dateHelperService.formatDateToIso(new Date()),
            toDate: this.dateHelperService.formatDateToIso(new Date())
        })
    }

    public lookup(arrayName: string, arrayId: number): boolean {
        if (this.criteria) {
            return this.criteria[arrayName].filter((x: { id: number }) => x.id == arrayId).length != 0 ? true : false
        }
    }

    public patchFormWithSelectedDates(fromDate: any, toDate: any): void {
        this.form.patchValue({
            fromDate: fromDate.value != null ? this.dateHelperService.formatDateToIso(new Date(fromDate.value)) : '',
            toDate: toDate.value != null ? this.dateHelperService.formatDateToIso(new Date(toDate.value)) : ''
        })
    }

    public toggleAllCheckboxes(form: FormGroup, array: string, allCheckboxes: string): void {
        this.fieldsetCriteriaService.toggleAllCheckboxes(form, array, allCheckboxes)
    }

    //#endregion

    //#region private methods

    private addSelectedCriteriaFromStorage(arrayName: string): void {
        const x = this.form.controls[arrayName] as FormArray
        this.criteria[arrayName].forEach((element: any) => {
            x.push(new FormControl({
                'id': element.id,
                'description': element.description
            }))
        })
    }

    private doSimpleUserTasks(): void {
        if (this.isAdmin == false) {
            if (this.localStorageService.getItem('ledger-criteria') == '') {
                const customer = this.customers.find(x => x.id == ConnectedUser.customerId)
                const controls = this.form.controls['customers'] as FormArray
                controls.push(new FormControl({
                    'id': customer.id,
                    'description': customer.description
                }))
                this.form.patchValue({
                    fromDate: this.dateHelperService.formatDateToIso(new Date(), false),
                    toDate: this.dateHelperService.formatDateToIso(new Date(), false),
                })
                setTimeout(() => {
                    const checkbox = document.getElementById('customer' + customer.id) as HTMLInputElement
                    if (checkbox != null) {
                        checkbox.checked = true
                    }
                }, 500)
            }
        }
    }

    private checkGroupCheckbox(allCheckbox: string, array: SimpleEntity[], formControlsArray: string): void {
        this.fieldsetCriteriaService.checkGroupCheckbox(this.form, allCheckbox, array, formControlsArray)
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    public getConnectedUserRole(): void {
        this.isAdmin = ConnectedUser.isAdmin
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            fromDate: ['', [Validators.required]],
            toDate: ['', [Validators.required]],
            customers: this.formBuilder.array([], Validators.required),
            destinations: this.formBuilder.array([], Validators.required),
            ships: this.formBuilder.array([], Validators.required),
            customersFilter: '',
            destinationsFilter: '',
            shipsFilter: '',
            allCustomersCheckbox: '',
            allDestinationsCheckbox: '',
            allShipsCheckbox: ''
        })
    }

    private navigateToList(): void {
        this.router.navigate(['ledgers/list'])
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('customers')
        this.populateDropdownFromLocalStorage('destinations')
        this.populateDropdownFromLocalStorage('ships')
    }

    private populateFieldsFromStoredVariables(): void {
        if (this.localStorageService.getItem('ledger-criteria')) {
            this.criteria = JSON.parse(this.localStorageService.getItem('ledger-criteria'))
            this.form.patchValue({
                fromDate: this.criteria.fromDate,
                toDate: this.criteria.toDate,
                customers: this.addSelectedCriteriaFromStorage('customers'),
                destinations: this.addSelectedCriteriaFromStorage('destinations'),
                ships: this.addSelectedCriteriaFromStorage('ships'),
                allCustomersCheckbox: this.criteria.allCustomersCheckbox,
                allDestinationsCheckbox: this.criteria.allDestinationsCheckbox,
                allShipsCheckbox: this.criteria.allShipsCheckbox
            })
        }
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private setSelectedDates(): void {
        if (this.criteria != undefined) {
            this.selectedRangeValue = new DateRange(new Date(this.criteria.fromDate), new Date(this.criteria.toDate))
        } else {
            this.selectedRangeValue = new DateRange(new Date(), new Date())
            this.form.patchValue({
                fromDate: this.dateHelperService.formatDateToIso(new Date(), false),
                toDate: this.dateHelperService.formatDateToIso(new Date(), false),
            })
        }
    }

    private storeCriteria(): void {
        this.localStorageService.saveItem('ledger-criteria', JSON.stringify(this.form.value))
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
    }

    //#endregion

    //#region getters

    get fromDate(): AbstractControl {
        return this.form.get('fromDate')
    }

    get toDate(): AbstractControl {
        return this.form.get('toDate')
    }

    //#endregion    

}
