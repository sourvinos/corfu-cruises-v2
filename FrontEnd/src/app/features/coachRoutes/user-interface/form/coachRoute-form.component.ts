import { ActivatedRoute, Router } from '@angular/router'
import { Component, HostListener } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
// Custom
import { CoachRouteReadDto } from '../../classes/dtos/coachRoute-read-dto'
import { CoachRouteService } from '../../classes/services/coachRoute.service'
import { CoachRouteWriteDto } from '../../classes/dtos/coachRoute-write-dto'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
    selector: 'coach-route-form',
    templateUrl: './coachRoute-form.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './coachRoute-form.component.css']
})

export class CoachRouteFormComponent {

    //#region variables

    private record: CoachRouteReadDto
    private recordId: number
    private subscription = new Subscription()
    public feature = 'coachRouteForm'
    public featureIcon = 'coachRoutes'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public isLoading = new Subject<boolean>()
    public parentUrl = '/coachRoutes'

    public arrowIcon = new BehaviorSubject('arrow_drop_down')
    public dropdownPorts: Observable<PortActiveVM[]>
    public isAutoCompleteDisabled = true

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private coachRouteService: CoachRouteService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private sessionStorageService: SessionStorageService,) { }

    //#region listeners

    @HostListener('window:resize', ['$event']) onResize(): void {
        this.setWindowWidth()
    }

    //#endregion

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.setRecordId()
        this.getRecord()
        this.populateFields()
        this.populateDropdowns()
        this.setWindowWidth()
    }

    ngAfterViewInit(): void {
        this.focusOnField()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    canDeactivate(): boolean {
        return this.helperService.goBackFromForm(this.form)
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
                this.coachRouteService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
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

    public openOrCloseAutoComplete(trigger: MatAutocompleteTrigger, element: any): void {
        this.helperService.openOrCloseAutocomplete(this.form, element, trigger)
    }

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.subscription.unsubscribe()
    }

    private filterAutocomplete(array: string, field: string, value: any): any[] {
        if (typeof value !== 'object') {
            const filtervalue = value.toLowerCase()
            return this[array].filter((element: { [x: string]: string; }) =>
                element[field].toLowerCase().startsWith(filtervalue))
        }
    }

    private flattenForm(): CoachRouteWriteDto {
        return {
            id: this.form.value.id,
            portId: this.form.value.port.id,
            abbreviation: this.form.value.abbreviation,
            description: this.form.value.description,
            hasTransfer: this.form.value.hasTransfer,
            isActive: this.form.value.isActive,
        }
    }

    private focusOnField(): void {
        this.helperService.focusOnField()
    }

    private getRecord(): Promise<any> {
        if (this.recordId != undefined) {
            return new Promise((resolve) => {
                const formResolved: FormResolved = this.activatedRoute.snapshot.data['coachRouteForm']
                if (formResolved.error == null) {
                    this.record = formResolved.record.body
                    resolve(this.record)
                } else {
                    this.modalActionResultService.open(this.messageSnackbarService.filterResponse(formResolved.error), 'error', ['ok']).subscribe(() => {
                        this.resetForm()
                        this.goBack()
                    })
                }
            })
        }
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            id: 0,
            abbreviation: ['', [Validators.required, Validators.maxLength(10)]],
            description: ['', [Validators.required, Validators.maxLength(128)]],
            port: ['', [Validators.required, ValidationService.RequireAutocomplete]],
            hasTransfer: true,
            isActive: true
        })
    }

    private populateDropdownFromStorage(table: string, filteredTable: string, formField: string, modelProperty: string): void {
        this[table] = JSON.parse(this.sessionStorageService.getItem(table))
        this[filteredTable] = this.form.get(formField).valueChanges.pipe(startWith(''), map(value => this.filterAutocomplete(table, modelProperty, value)))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromStorage('ports', 'dropdownPorts', 'port', 'description')
    }

    private populateFields(): void {
        if (this.record != undefined) {
            this.form.setValue({
                id: this.record.id,
                abbreviation: this.record.abbreviation,
                description: this.record.description,
                port: { 'id': this.record.port.id, 'description': this.record.port.description },
                hasTransfer: this.record.hasTransfer,
                isActive: this.record.isActive
            })
        }
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(coachRoute: CoachRouteWriteDto): void {
        this.coachRouteService.save(coachRoute).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
            },
            error: (errorFromInterceptor) => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false)
            }
        })
    }

    private setRecordId(): void {
        this.activatedRoute.params.subscribe(x => {
            this.recordId = x.id
        })
    }

    private setWindowWidth(): void {
        this.helperService.setWindowWidth('form-wrapper')
    }

    //#endregion

    //#region getters

    get abbreviation(): AbstractControl {
        return this.form.get('abbreviation')
    }

    get description(): AbstractControl {
        return this.form.get('description')
    }

    get port(): AbstractControl {
        return this.form.get('port')
    }

    //#endregion

}
