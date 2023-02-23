import { Component, NgZone } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
// Custom
import { FieldsetCriteriaService } from 'src/app/shared/services/fieldset-criteria.service'
import { LocalStorageService } from './../../../../shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ShipRouteActiveVM } from './../../../shipRoutes/classes/view-models/shipRoute-active-vm'

@Component({
    selector: 'manifest-route-selector',
    templateUrl: './manifest-route-selector.component.html',
    styleUrls: ['../../../../../assets/styles/dialogs.css', './manifest-route-selector.component.css']
})

export class ManifestRouteSelectorComponent {

    //#region variables

    private criteria: ShipRouteActiveVM
    private feature = 'manifestCriteria'
    public form: FormGroup
    public shipRoutes: ShipRouteActiveVM[] = []

    //#endregion

    constructor(private dialogRef: MatDialogRef<ManifestRouteSelectorComponent>, private fieldsetCriteriaService: FieldsetCriteriaService, private formBuilder: FormBuilder, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private ngZone: NgZone) { }

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

    public continue(): void {
        this.ngZone.run(() => {
            const x = JSON.parse(this.localStorageService.getItem('shipRoutes'))
            const z = x.find((z: any) => z.id == this.form.value.shipRoutes[0].id)
            this.dialogRef.close(z)
        })
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public lookup(array: string, arrayId: number): boolean {
        if (this.criteria) {
            return this.criteria[array].filter((x: { id: number }) => x.id == arrayId).length != 0 ? true : false
        }
    }

    public updateRadioButtons(form: FormGroup, classname: any, idName: any, id: any, description: any): void {
        this.fieldsetCriteriaService.updateRadioButtons(form, classname, idName, id, description)
    }

    //#endregion

    //#region private methods

    private initForm(): void {
        this.form = this.formBuilder.group({
            shipRoutes: this.formBuilder.array([], Validators.required)
        })
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('shipRoutes')
    }

    //#endregion

}
