import { Component, NgZone } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
// Custom
import { DriverActiveVM } from './../../../drivers/classes/view-models/driver-active-vm'
import { FieldsetCriteriaService } from 'src/app/shared/services/fieldset-criteria.service'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'

@Component({
    selector: 'reservation-to-driver-form',
    templateUrl: './reservation-to-driver-form.component.html',
    styleUrls: ['../../../../../assets/styles/dialogs.css', './reservation-to-driver-form.component.css']
})

export class ReservationToDriverComponent {

    //#region variables

    private feature = 'assignToDriver'
    public drivers: DriverActiveVM[] = []
    public form: FormGroup

    //#endregion

    constructor(private dialogRef: MatDialogRef<ReservationToDriverComponent>, private fieldsetCriteriaService: FieldsetCriteriaService, private formBuilder: FormBuilder, private messageLabelService: MessageLabelService, private ngZone: NgZone, private sessionStorageService: SessionStorageService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateDropdowns()
    }

    //#endregion

    //#region public methods

    public close(): void {
        this.dialogRef.close()
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public save(): void {
        this.ngZone.run(() => {
            this.dialogRef.close(this.form.value)
        })
    }

    public updateRadioButtons(form: FormGroup, classname: any, idName: any, id: any, description: any): void {
        this.fieldsetCriteriaService.updateRadioButtons(form, classname, idName, id, description)
    }

    //#endregion

    //#region private methods

    private initForm(): void {
        this.form = this.formBuilder.group({
            drivers: this.formBuilder.array([], Validators.required)
        })
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.sessionStorageService.getItem(table))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('drivers')
    }

    //#endregion

}
