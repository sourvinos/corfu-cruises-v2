import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Subject, Subscription } from 'rxjs'
// Custom
import { DestinationReadDto } from '../classes/dtos/destination-read-dto'
import { DestinationService } from '../classes/services/destination.service'
import { DestinationWriteDto } from '../classes/dtos/destination-write-dto'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'

@Component({
    selector: 'destination-form',
    templateUrl: './destination-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css', './destination-form.component.css']
})

export class DestinationFormComponent {

    //#region variables

    private record: DestinationReadDto
    private recordId: number
    private subscription = new Subscription()
    public feature = 'destinationForm'
    public featureIcon = 'destinations'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public isLoading = new Subject<boolean>()
    public isNewRecord: boolean
    public parentUrl = '/destinations'

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private destinationService: DestinationService, private dialogService: DialogService, private formBuilder: FormBuilder, private helperService: HelperService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.setRecordId()
        this.setNewRecord()
        this.getRecord()
        this.populateFields()
    }

    ngAfterViewInit(): void {
        this.focusOnField()
    }

    ngOnDestroy(): void {
        this.cleanup()
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
                this.destinationService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
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

    private flattenForm(): DestinationWriteDto {
        const destination = {
            id: this.form.value.id,
            abbreviation: this.form.value.abbreviation,
            description: this.form.value.description,
            isActive: this.form.value.isActive
        }
        return destination
    }

    private focusOnField(): void {
        this.helperService.focusOnField('')
    }

    private getRecord(): Promise<any> {
        if (this.isNewRecord == false) {
            return new Promise((resolve) => {
                const formResolved: FormResolved = this.activatedRoute.snapshot.data['destinationForm']
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
            isActive: true
        })
    }

    private populateFields(): void {
        if (this.isNewRecord == false) {
            this.form.setValue({
                id: this.record.id,
                abbreviation: this.record.abbreviation,
                description: this.record.description,
                isActive: this.record.isActive
            })
        }
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(destination: DestinationWriteDto): void {
        this.destinationService.save(destination).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.success(), 'success', this.parentUrl, this.form)
            },
            error: (errorFromInterceptor) => {
                this.helperService.doPostSaveFormTasks(this.messageSnackbarService.filterResponse(errorFromInterceptor), 'error', this.parentUrl, this.form, false)
            }
        })
    }

    private setNewRecord(): void {
        this.isNewRecord = this.recordId == null
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

    //#endregion

}
