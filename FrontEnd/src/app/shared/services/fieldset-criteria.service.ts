import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class FieldsetCriteriaService {

    constructor(private formBuilder: FormBuilder) { }

    public checkGroupCheckbox(form: FormGroup, allCheckbox: string, arrayName: any, formControlsArray: string): void {
        const selected = form.controls[formControlsArray] as FormArray
        if (selected.length == arrayName.length) {
            document.querySelector<HTMLInputElement>('#' + allCheckbox).checked = true
            form.patchValue({
                [allCheckbox]: true
            })
        }
    }

    public filterList(searchString: string, list: any[]): void {
        list.forEach((element) => {
            const input = document.getElementById(element.description) as HTMLInputElement
            if (input != null || input != undefined) {
                element.description.toLowerCase().includes(searchString.toLowerCase()) == false
                    ? input.classList.add('no-display')
                    : input.classList.remove('no-display')
            }
        })
    }

    public toggleAllCheckboxes(form: FormGroup, array: string, allCheckboxes: string): void {
        const selected = form.controls[array + 's'] as FormArray
        selected.clear()
        const checkboxes = document.querySelectorAll<HTMLInputElement>('.' + array)
        checkboxes.forEach(checkbox => {
            checkbox.checked = !form.value[allCheckboxes]
            if (checkbox.checked) {
                selected.push(this.formBuilder.group({
                    id: [checkbox.value, Validators.required],
                    description: document.getElementById(array + '-label' + checkbox.value).innerHTML
                }))
            }
        })
    }

    public updateRadioButtons(form: FormGroup, classname: any, idName: any, id: any, description: any): void {
        const radios = document.getElementsByClassName(classname) as HTMLCollectionOf<HTMLInputElement>
        for (let i = 0; i < radios.length; i++) {
            radios[i].checked = false
        }
        const radio = document.getElementById(idName + id) as HTMLInputElement
        radio.checked = true
        const x = form.controls[classname] as FormArray
        x.clear()
        x.push(new FormControl({
            'id': id,
            'description': description
        }))
    }

    public checkboxChange(form: FormGroup, event: any, allCheckbox: string, formControlsArray: string, array: any[], description: string): void {
        const selected = form.controls[formControlsArray] as FormArray
        if (event.target.checked) {
            selected.push(this.formBuilder.group({
                id: [parseInt(event.target.value), Validators.required],
                description: [description]
            }))
        } else {
            const index = selected.controls.findIndex(x => x.value.id == parseInt(event.target.value))
            selected.removeAt(index)
        }
        if (selected.length == 0 || selected.length != array.length) {
            document.querySelector<HTMLInputElement>('#all-' + formControlsArray).checked = false
            form.patchValue({
                [allCheckbox]: false
            })
        } else {
            if (selected.length == array.length) {
                document.querySelector<HTMLInputElement>('#all-' + formControlsArray).checked = true
                form.patchValue({
                    [allCheckbox]: true
                })
            }
        }
    }

}
