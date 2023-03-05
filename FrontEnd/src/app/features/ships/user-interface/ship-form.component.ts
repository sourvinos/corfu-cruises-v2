import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
// Custom
import { DialogService } from 'src/app/shared/services/dialog.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { ShipOwnerActiveVM } from '../../shipOwners/classes/view-models/shipOwner-active-vm'
import { ShipReadDto } from '../classes/dtos/ship-read-dto'
import { ShipService } from '../classes/services/ship.service'
import { ShipWriteDto } from '../classes/dtos/ship-write-dto'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
    selector: 'ship-form',
    templateUrl: './ship-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css', './ship-form.component.css']
})

export class ShipFormComponent {

    //#region variables 

    private record: ShipReadDto
    private unsubscribe = new Subject<void>()
    public feature = 'shipForm'
    public featureIcon = 'ships'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public isLoading = new Subject<boolean>()
    public parentUrl = '/ships'

    public isAutoCompleteDisabled = true
    public activeShipOwners: Observable<ShipOwnerActiveVM[]>

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private sessionStorageService: SessionStorageService, private shipService: ShipService) {
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
        this.populateDropdowns()
        this.focusOnField('description')
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
                this.shipService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
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
            return this[array].filter((element: { [x: string]: string; }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): ShipWriteDto {
        const ship = {
            id: this.form.value.id,
            shipOwnerId: this.form.value.shipOwner.id,
            description: this.form.value.description,
            imo: this.form.value.imo,
            flag: this.form.value.flag,
            registryNo: this.form.value.registryNo,
            manager: this.form.value.manager,
            managerInGreece: this.form.value.managerInGreece,
            agent: this.form.value.agent,
            isActive: this.form.value.isActive
        }
        return ship
    }

    private focusOnField(field: string): void {
        this.helperService.focusOnField(field)
    }

    private getRecord(): Promise<any> {
        const promise = new Promise((resolve) => {
            const formResolved: FormResolved = this.activatedRoute.snapshot.data['shipForm']
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
            description: ['', [Validators.required, Validators.maxLength(128)]],
            shipOwner: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            imo: ['', [Validators.maxLength(128)]],
            flag: ['', [Validators.maxLength(128)]],
            registryNo: ['', [Validators.maxLength(128)]],
            manager: ['', [Validators.maxLength(128)]],
            managerInGreece: ['', [Validators.maxLength(128)]],
            agent: ['', [Validators.maxLength(128)]],
            isActive: true
        })
    }

    private populateDropdownFromStorage(table: string, filteredTable: string, formField: string, modelProperty: string): void {
        this[table] = JSON.parse(this.sessionStorageService.getItem(table))
        this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromStorage('shipOwners', 'activeShipOwners', 'shipOwner', 'description')
    }

    private populateFields(): void {
        this.form.setValue({
            id: this.record.id,
            shipOwner: { 'id': this.record.shipOwner.id, 'description': this.record.shipOwner.description },
            description: this.record.description,
            imo: this.record.imo,
            flag: this.record.flag,
            registryNo: this.record.registryNo,
            manager: this.record.manager,
            managerInGreece: this.record.managerInGreece,
            agent: this.record.agent,
            isActive: this.record.isActive
        })
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(ship: ShipWriteDto): void {
        this.shipService.save(ship).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
            },
            error: (errorFromInterceptor) => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false)
            }
        })
    }

    //#endregion

    //#region getters

    get description(): AbstractControl {
        return this.form.get('description')
    }

    get shipOwner(): AbstractControl {
        return this.form.get('shipOwner')
    }

    get imo(): AbstractControl {
        return this.form.get('imo')
    }

    get flag(): AbstractControl {
        return this.form.get('flag')
    }

    get manager(): AbstractControl {
        return this.form.get('manager')
    }

    get managerInGreece(): AbstractControl {
        return this.form.get('managerInGreece')
    }

    get agent(): AbstractControl {
        return this.form.get('agent')
    }

    get registryNo(): AbstractControl {
        return this.form.get('registryNo')
    }

    get isActive(): AbstractControl {
        return this.form.get('isActive')
    }

    //#endregion

}
