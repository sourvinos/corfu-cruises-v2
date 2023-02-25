import { Component, Inject, NgZone } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Observable, Subject } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
// Custom
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { LocalStorageService } from './../../../../shared/services/local-storage.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { NationalityDropdownVM } from 'src/app/features/nationalities/classes/view-models/nationality-dropdown-vm'
import { PassengerReadDto } from '../../classes/dtos/form/passenger-read-dto'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { GenderActiveVM } from 'src/app/features/genders/classes/view-models/gender-active-vm'

@Component({
    selector: 'passenger-form',
    templateUrl: './passenger-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './passenger-form.component.css']
})

export class PassengerFormComponent {

    //#region variables

    private record: PassengerReadDto
    private unsubscribe = new Subject<void>()
    public feature = 'passengerForm'
    public featureIcon = ''
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = null

    public minBirthDate = new Date(new Date().getFullYear() - 99, 0, 1)
    public maxBirthDate = new Date()

    public isAutoCompleteDisabled = true

    public genders: GenderActiveVM[] = []
    public filteredGenders: Observable<GenderActiveVM[]>
    public nationalities: NationalityDropdownVM[] = []
    public filteredNationalities: Observable<NationalityDropdownVM[]>

    public isAdmin: boolean

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: PassengerReadDto, private dateAdapter: DateAdapter<any>, private dialogRef: MatDialogRef<PassengerFormComponent>, private formBuilder: FormBuilder, private helperService: HelperService, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private ngZone: NgZone) {
        this.record = data
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateDropdowns()
        this.populateFields()
        this.setLocale()
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

    public close(): void {
        this.dialogRef.close()
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

    public save(): void {
        this.ngZone.run(() => {
            this.dialogRef.close(this.flattenForm(this.form))
        })
    }

    //#endregion

    //#region private methods

    private assignTempIdToNewPassenger(): number {
        return Math.round(Math.random() * new Date().getMilliseconds())
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private filterAutocomplete(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(form: FormGroup): any {
        const passenger = {
            'id': form.value.id == 0 ? this.assignTempIdToNewPassenger() : form.value.id,
            'reservationId': form.value.reservationId,
            'lastname': form.value.lastname,
            'firstname': form.value.firstname,
            'occupantId': 2,
            'birthdate': form.value.birthdate,
            'nationality': form.value.nationality,
            'gender': form.value.gender,
            'specialCare': form.value.specialCare,
            'remarks': form.value.remarks,
            'isCheckedIn': form.value.isCheckedIn
        }
        return passenger
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: this.data.id,
            reservationId: this.data.reservationId,
            gender: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            nationality: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            lastname: ['', [Validators.required, Validators.maxLength(128)]],
            firstname: ['', [Validators.required, Validators.maxLength(128)]],
            birthdate: ['', [Validators.required, Validators.maxLength(10)]],
            specialCare: ['', Validators.maxLength(128)],
            remarks: ['', Validators.maxLength(128)],
            isCheckedIn: false,
        })
    }

    private populateDropdownFromLocalStorage(table: string, filteredTable: string, formField: string, modelProperty: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
        this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('genders', 'filteredGenders', 'gender', 'description')
        this.populateDropdownFromLocalStorage('nationalities', 'filteredNationalities', 'nationality', 'description')
    }

    private populateFields(): void {
        this.form.setValue({
            id: this.record.id,
            reservationId: this.record.reservationId,
            gender: { 'id': this.record.gender.id, 'description': this.record.gender.description },
            nationality: { 'id': this.record.nationality.id, 'description': this.record.nationality.description },
            lastname: this.record.lastname,
            firstname: this.record.firstname,
            birthdate: this.record.birthdate,
            specialCare: this.record.specialCare,
            remarks: this.record.remarks,
            isCheckedIn: this.record.isCheckedIn
        })
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    //#endregion

    //#region getters

    get lastname(): AbstractControl {
        return this.form.get('lastname')
    }

    get firstname(): AbstractControl {
        return this.form.get('firstname')
    }

    get nationality(): AbstractControl {
        return this.form.get('nationality')
    }

    get gender(): AbstractControl {
        return this.form.get('gender')
    }

    get birthdate(): AbstractControl {
        return this.form.get('birthdate')
    }

    get specialCare(): AbstractControl {
        return this.form.get('specialCare')
    }

    get remarks(): AbstractControl {
        return this.form.get('remarks')
    }

    get isCheckedIn(): AbstractControl {
        return this.form.get('isCheckedIn')
    }

    //#endregion

}
