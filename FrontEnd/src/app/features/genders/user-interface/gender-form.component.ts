import { ActivatedRoute, Router } from '@angular/router'
import { Component, HostListener } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { Subject, Subscription } from 'rxjs'
// Custom
import { DialogService } from 'src/app/shared/services/dialog.service'
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { GenderReadDto } from '../classes/dtos/gender-read-dto'
import { GenderService } from '../classes/services/gender.service'
import { GenderWriteDto } from '../classes/dtos/gender-write-dto'
import { HelperService, indicate } from 'src/app/shared/services/helper.service'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'

@Component({
    selector: 'gender-form',
    templateUrl: './gender-form.component.html',
    styleUrls: ['../../../../assets/styles/forms.css', './gender-form.component.css']
})

export class GenderFormComponent {

    //#region variables 

    private record: GenderReadDto
    private recordId: number
    private subscription = new Subscription()
    public feature = 'genderForm'
    public featureIcon = 'genders'
    public form: FormGroup
    public icon = 'arrow_back'
    public input: InputTabStopDirective
    public isLoading = new Subject<boolean>()
    public parentUrl = '/genders'

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dialogService: DialogService, private formBuilder: FormBuilder, private genderService: GenderService, private helperService: HelperService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router) { }

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

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onDelete(): void {
        this.dialogService.open(this.messageSnackbarService.warning(), 'warning', 'right-buttons', ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.genderService.delete(this.form.value.id).pipe(indicate(this.isLoading)).subscribe({
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

    private flattenForm(): GenderWriteDto {
        return {
            id: this.form.value.id,
            description: this.form.value.description,
            isActive: this.form.value.isActive
        }
    }

    private focusOnField(): void {
        this.helperService.focusOnField()
    }

    private getRecord(): Promise<any> {
        if (this.recordId != undefined) {
            return new Promise((resolve) => {
                const formResolved: FormResolved = this.activatedRoute.snapshot.data['genderForm']
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
            isActive: true
        })
    }

    private populateFields(): void {
        if (this.record != undefined) {
            this.form.setValue({
                id: this.record.id,
                description: this.record.description,
                isActive: this.record.isActive
            })
        }
    }

    private resetForm(): void {
        this.form.reset()
    }

    private saveRecord(gender: GenderWriteDto): void {
        this.genderService.save(gender).pipe(indicate(this.isLoading)).subscribe({
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

    get description(): AbstractControl {
        return this.form.get('description')
    }

    get isActive(): AbstractControl {
        return this.form.get('isActive')
    }

    //#endregion

}
