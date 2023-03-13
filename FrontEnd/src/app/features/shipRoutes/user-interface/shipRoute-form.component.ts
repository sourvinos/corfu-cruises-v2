import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Subject, Subscription } from 'rxjs'
// Custom
import { DialogService } from 'src/app/shared/services/dialog.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { ShipRouteReadDto } from '../classes/dtos/shipRoute-read-dto'
import { ShipRouteService } from '../classes/services/shipRoute.service'
import { ShipRouteWriteDto } from '../classes/dtos/shipRoute-write-dto'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
    selector: 'ship-route-form',
    templateUrl: './shipRoute-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css', './shipRoute-form.component.css']
})

export class ShipRouteFormComponent {

    //#region variables 

    private record: ShipRouteReadDto
    private recordId: number
    private subscription = new Subscription()
    public feature = 'shipRouteForm'
    public featureIcon = 'shipRoutes'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public isLoading = new Subject<boolean>()
    public parentUrl = '/shipRoutes'

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private shipRouteService: ShipRouteService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.setRecordId()
        this.getRecord()
        this.populateFields()
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

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onDelete(): void {
        this.dialogService.open(this.messageSnackbarService.warning(), 'warning', 'right-buttons', ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.shipRouteService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
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

    private flattenForm(): ShipRouteWriteDto {
        return {
            id: this.form.value.id,
            description: this.form.value.description,
            fromPort: this.form.value.fromPort,
            fromTime: this.form.value.fromTime,
            viaPort: this.form.value.viaPort,
            viaTime: this.form.value.viaTime,
            toPort: this.form.value.toPort,
            toTime: this.form.value.toTime,
            isActive: this.form.value.isActive
        }
    }

    private focusOnField(): void {
        this.helperService.focusOnField()
    }

    private getRecord(): Promise<any> {
        if (this.recordId != undefined) {
            return new Promise((resolve) => {
                const formResolved: FormResolved = this.activatedRoute.snapshot.data['shipRouteForm']
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
            description: ['', [Validators.required, Validators.maxLength(128)]],
            fromPort: ['', [Validators.required, Validators.maxLength(128)]], fromTime: ['', [Validators.required, ValidationService.isTime]],
            viaPort: ['', [Validators.maxLength(128)]], viaTime: ['', [ValidationService.isTime]],
            toPort: ['', [Validators.required, Validators.maxLength(128)]], toTime: ['', [Validators.required, ValidationService.isTime]],
            isActive: true
        })
    }

    private populateFields(): void {
        if (this.recordId != undefined) {
            this.form.setValue({
                id: this.record.id,
                description: this.record.description,
                fromPort: this.record.fromPort, fromTime: this.record.fromTime,
                viaPort: this.record.viaPort, viaTime: this.record.viaTime,
                toPort: this.record.toPort, toTime: this.record.toTime,
                isActive: this.record.isActive
            })
        }
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(shipRoute: ShipRouteWriteDto): void {
        this.shipRouteService.save(shipRoute).pipe(indicate(this.isLoading)).subscribe({
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

    //#endregion

    //#region getters

    get description(): AbstractControl {
        return this.form.get('description')
    }

    get fromPort(): AbstractControl {
        return this.form.get('fromPort')
    }

    get fromTime(): AbstractControl {
        return this.form.get('fromTime')
    }

    get viaPort(): AbstractControl {
        return this.form.get('viaPort')
    }

    get viaTime(): AbstractControl {
        return this.form.get('viaTime')
    }

    get toPort(): AbstractControl {
        return this.form.get('toPort')
    }
    get toTime(): AbstractControl {
        return this.form.get('toTime')
    }

    get isActive(): AbstractControl {
        return this.form.get('isActive')
    }

    //#endregion

}
