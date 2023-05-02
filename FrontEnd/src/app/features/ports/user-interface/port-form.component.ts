import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Subscription } from 'rxjs'
// Custom
import { DialogService } from 'src/app/shared/services/dialog.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { MessageInputHintService } from 'src/app/shared/services/message-input-hint.service'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { MessageDialogService } from 'src/app/shared/services/message-dialog.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { PortReadDto } from '../classes/dtos/port-read-dto'
import { PortService } from '../classes/services/port.service'
import { PortWriteDto } from '../classes/dtos/port-write-vm'

@Component({
    selector: 'port-form',
    templateUrl: './port-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css', './port-form.component.css']
})

export class PortFormComponent {

    //#region variables

    private record: PortReadDto
    private recordId: number
    private subscription = new Subscription()
    public feature = 'portForm'
    public featureIcon = 'ports'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public parentUrl = '/ports'

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private messageHintService: MessageInputHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageDialogService, private modalActionResultService: ModalActionResultService, private portService: PortService, private router: Router) { }

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
        this.dialogService.open(this.messageSnackbarService.confirmDelete(), 'warning', ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.portService.delete(this.form.value.id).subscribe({
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

    private flattenForm(): PortWriteDto {
        return {
            id: this.form.value.id,
            abbreviation: this.form.value.abbreviation,
            description: this.form.value.description,
            stopOrder: this.form.value.stopOrder,
            isActive: this.form.value.isActive
        }
    }

    private focusOnField(): void {
        this.helperService.focusOnField()
    }

    private getRecord(): Promise<any> {
        if (this.recordId != undefined) {
            return new Promise((resolve) => {
                const formResolved: FormResolved = this.activatedRoute.snapshot.data['portForm']
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
            abbreviation: ['', [Validators.required, Validators.maxLength(5)]],
            description: ['', [Validators.required, Validators.maxLength(128)]],
            stopOrder: [0, [Validators.required, Validators.min(1), Validators.max(9)]],
            isActive: true
        })
    }

    private populateFields(): void {
        if (this.recordId != undefined) {
            this.form.setValue({
                id: this.record.id,
                abbreviation: this.record.abbreviation,
                description: this.record.description,
                stopOrder: this.record.stopOrder,
                isActive: this.record.isActive
            })
        }
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(port: PortWriteDto): void {
        this.portService.save(port).subscribe({
            complete: () => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
            },
            error: (errorFromInterceptor) => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false, false)
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

    get abbreviation(): AbstractControl {
        return this.form.get('abbreviation')
    }

    get description(): AbstractControl {
        return this.form.get('description')
    }

    get stopOrder(): AbstractControl {
        return this.form.get('stopOrder')
    }

    //#endregion

}
