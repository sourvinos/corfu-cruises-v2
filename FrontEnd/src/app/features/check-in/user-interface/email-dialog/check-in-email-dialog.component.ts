import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Subject } from 'rxjs'
// Custom
import { MessageInputHintService } from 'src/app/shared/services/message-input-hint.service'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'

@Component({
    selector: 'check-in-email-dialog',
    templateUrl: './check-in-email-dialog.component.html',
    styleUrls: ['./check-in-email-dialog.component.css']
})

export class CheckInEmailDialogComponent {

    //#region variables

    private feature = 'dialog'
    public content: any
    public iconStyle: any
    public titleColor = ''
    public isLoading = new Subject<boolean>()
    public form: FormGroup

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<CheckInEmailDialogComponent>, private formBuilder: FormBuilder, private messageHintService: MessageInputHintService, private messageLabelService: MessageLabelService) {
        this.iconStyle = data.iconStyle
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
    }

    //#endregion

    //#region public methods

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public isObject(): boolean {
        return typeof this.content === 'object'
    }

    public onClose(): void {
        this.dialogRef.close()
    }

    public onSendEmail(): void {
        this.dialogRef.close(this.form.value.email)
    }

    //#endregion

    //#region private methods

    private initForm(): void {
        this.form = this.formBuilder.group({
            refNo: 'PA9999',
            email: [this.data.message, Validators.required]
        })
    }

    //#endregion

    //#region getters

    get email(): AbstractControl {
        return this.form.get('email')
    }

    //#endregion

}
