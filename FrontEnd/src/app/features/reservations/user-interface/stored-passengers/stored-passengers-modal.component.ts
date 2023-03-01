import { Component, NgZone } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
// Custom
import { FieldsetCriteriaService } from 'src/app/shared/services/fieldset-criteria.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'stored-passengers-modal',
    templateUrl: './stored-passengers-modal.component.html',
    styleUrls: ['../../../../../assets/styles/dialogs.css', './stored-passengers-modal.component.css']
})

export class StoredPassengersModalComponent {

    //#region variables

    private feature = 'tempPassengersDialog'
    public form: FormGroup
    public options: any[]

    //#endregion

    constructor(private dialogRef: MatDialogRef<StoredPassengersModalComponent>, private fieldsetCriteriaService: FieldsetCriteriaService, private formBuilder: FormBuilder, private messageLabelService: MessageLabelService, private ngZone: NgZone) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateOptions()
    }

    //#endregion

    //#region public methods

    public cancel(): void {
        this.dialogRef.close()
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public updateRadioButtons(form: FormGroup, classname: any, idName: any, id: any, description: any): void {
        this.fieldsetCriteriaService.updateRadioButtons(form, classname, idName, id, description)
    }

    public save(): void {
        this.ngZone.run(() => {
            this.dialogRef.close(this.form.value)
        })
    }

    //#endregion

    //#region private methods

    private initForm(): void {
        this.form = this.formBuilder.group({
            options: this.formBuilder.array([], Validators.required)
        })
    }

    private populateOptions(): void {
        this.options = [
            { 'id': 1, 'description': 'Add' },
            { 'id': 2, 'description': 'Replace' }
        ]
    }

    //#endregion

}
