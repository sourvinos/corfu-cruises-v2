import { ActivatedRoute, Router } from '@angular/router'
import { Component, Inject } from '@angular/core'
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { map, startWith, takeUntil } from 'rxjs/operators'
// Custom
import { DialogService } from 'src/app/shared/services/dialog.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { GenderActiveVM } from '../../genders/classes/view-models/gender-active-vm'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { NationalityDropdownVM } from '../../nationalities/classes/view-models/nationality-dropdown-vm'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { ShipActiveVM } from '../../ships/classes/view-models/ship-active-vm'
import { ShipCrewReadDto } from '../classes/dtos/shipCrew-read-dto'
import { ShipCrewService } from '../classes/services/shipCrew.service'
import { ShipCrewWriteDto } from '../classes/dtos/shipCrew-write-dto'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
    selector: 'ship-crew-form',
    templateUrl: './shipCrew-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css', './shipCrew-form.component.css'],
})

export class ShipCrewFormComponent {

    //#region variables

    private record: ShipCrewReadDto
    private unsubscribe = new Subject<void>()
    public feature = 'shipCrewForm'
    public featureIcon = 'shipCrews'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public isLoading = new Subject<boolean>()
    public parentUrl = '/shipCrews'

    public isAutoCompleteDisabled = true
    public activeGenders: Observable<GenderActiveVM[]>
    public activeNationalities: Observable<NationalityDropdownVM[]>
    public activeShips: Observable<ShipActiveVM[]>

    public minBirthDate = new Date(new Date().getFullYear() - 99, 0, 1)
    public maxBirthDate = new Date()

    //#endregion

    constructor(@Inject(MAT_DATE_LOCALE) private locale: string, private activatedRoute: ActivatedRoute, private crewService: ShipCrewService, private dateAdapter: DateAdapter<any>, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private interactionService: InteractionService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private sessionStorageService: SessionStorageService, private shipCrewService: ShipCrewService) {
        this.activatedRoute.params.subscribe(x => {
            if (x.id) {
                this.initForm()
                this.getRecord()
                this.populateFields()
            } else {
                this.initForm()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.populateDropDowns()
        this.focusOnField('lastname')
        this.subscribeToInteractionService()
        this.setLocale()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    canDeactivate(): boolean {
        if (this.form.dirty) {
            this.dialogService.open(this.messageSnackbarService.askConfirmationToAbortEditing(), 'warning', 'right-buttons', ['abort', 'ok']).subscribe(response => {
                if (response) {
                    this.resetForm()
                    this.goBack()
                    return true
                }
            })
            return false
        } else {
            return true
        }
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
                this.crewService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
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

    private flattenForm(): ShipCrewWriteDto {
        const crew = {
            id: this.form.value.id,
            shipId: this.form.value.ship.id,
            genderId: this.form.value.gender.id,
            nationalityId: this.form.value.nationality.id,
            lastname: this.form.value.lastname,
            firstname: this.form.value.firstname,
            birthdate: this.form.value.birthdate,
            isActive: this.form.value.isActive
        }
        return crew
    }

    private focusOnField(field: string): void {
        this.helperService.focusOnField(field)
    }

    private getRecord(): Promise<any> {
        const promise = new Promise((resolve) => {
            const formResolved: FormResolved = this.activatedRoute.snapshot.data['shipCrewForm']
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
            lastname: ['', [Validators.required, Validators.maxLength(128)]],
            firstname: ['', [Validators.required, Validators.maxLength(128)]],
            birthdate: ['', [Validators.required]],
            ship: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            nationality: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            gender: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            isActive: true
        })
    }

    private populateDropdownFromStorage(table: string, filteredTable: string, formField: string, modelProperty: string): void {
        this[table] = JSON.parse(this.sessionStorageService.getItem(table))
        this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
    }

    private populateDropDowns(): void {
        this.populateDropdownFromStorage('genders', 'activeGenders', 'gender', 'description')
        this.populateDropdownFromStorage('nationalities', 'activeNationalities', 'nationality', 'description')
        this.populateDropdownFromStorage('ships', 'activeShips', 'ship', 'description')
    }

    private populateFields(): void {
        this.form.setValue({
            id: this.record.id,
            lastname: this.record.lastname,
            firstname: this.record.firstname,
            birthdate: this.record.birthdate,
            ship: { 'id': this.record.ship.id, 'description': this.record.ship.description },
            nationality: { 'id': this.record.nationality.id, 'description': this.record.nationality.description },
            gender: { 'id': this.record.gender.id, 'description': this.record.gender.description },
            isActive: this.record.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(shipCrew: ShipCrewWriteDto): void {
        this.shipCrewService.save(shipCrew).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
            },
            error: (errorFromInterceptor) => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false)
            }
        })
    }

    private setLocale(): void {
        this.locale = this.sessionStorageService.getLanguage()
        this.dateAdapter.setLocale(this.locale)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setLocale()
        })
    }

    //#endregion

    //#region getters

    get lastname(): AbstractControl {
        return this.form.get('lastname')
    }

    get firstname(): AbstractControl {
        return this.form.get('firstname')
    }

    get birthdate(): AbstractControl {
        return this.form.get('birthdate')
    }

    get ship(): AbstractControl {
        return this.form.get('ship')
    }

    get nationality(): AbstractControl {
        return this.form.get('nationality')
    }

    get gender(): AbstractControl {
        return this.form.get('gender')
    }

    //#endregion

}
