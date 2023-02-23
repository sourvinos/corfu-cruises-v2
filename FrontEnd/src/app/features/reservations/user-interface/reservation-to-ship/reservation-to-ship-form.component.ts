import { Component, NgZone } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
// Custom
import { FieldsetCriteriaService } from 'src/app/shared/services/fieldset-criteria.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { LocalStorageService } from './../../../../shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ShipActiveVM } from '../../../ships/classes/view-models/ship-active-vm'

@Component({
    selector: 'reservation-to-ship-form',
    templateUrl: './reservation-to-ship-form.component.html',
    styleUrls: ['../../../../../assets/styles/dialogs.css', './reservation-to-ship-form.component.css']
})

export class ReservationToShipComponent {

    //#region variables

    private feature = 'assignToShip'
    public ships: ShipActiveVM[] = []
    public form: FormGroup

    //#endregion

    constructor(private dialogRef: MatDialogRef<ReservationToShipComponent>, private fieldsetCriteriaService: FieldsetCriteriaService, private formBuilder: FormBuilder, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private ngZone: NgZone) { }

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
            ships: this.formBuilder.array([], Validators.required)
        })
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('ships')
    }

    //#endregion

}
