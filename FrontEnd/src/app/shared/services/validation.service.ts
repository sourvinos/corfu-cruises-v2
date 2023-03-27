import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms'

export class ValidationService {

    static childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
        const [firstControlName, ...otherControlNames] = Object.keys(formGroup.controls || {})
        const isValid = otherControlNames.every(controlName => formGroup.get(controlName).value === formGroup.get(firstControlName).value)
        return isValid ? null : { childrenNotEqual: true }
    }

    static beginsOrEndsWithSpace(control: AbstractControl): { [key: string]: any } {
        const pattern = /(^\s+)|(\s+$)/
        return pattern.test(control.value) ? { beginsOrEndsWithSpace: true } : null
    }

    static containsSpace(control: AbstractControl): { [key: string]: any } {
        return control.value && (control.value as string).indexOf(' ') !== -1 ? { containsSpace: true } : null
    }

    static containsIllegalCharacters(control: AbstractControl): { [key: string]: any } {
        const pattern = /^[a-zA-Z\d-_]+$/
        return pattern.test(control.value) ? null : { containsIllegalCharacters: true }
    }

    static isGreaterThanZero(control: AbstractControl): { [key: string]: any } {
        return control.value == 0 ? { isGreaterThanZero: false } : null
    }

    static isTime(control: AbstractControl): { [key: string]: any } {
        if (control.value) {
            const pattern = /\b([01][0-9]|2[0-3]):([0-5][0-9])\b/g
            return pattern.test(control.value) ? null : { isTime: false }
        }
    }

    static RequireAutocomplete(control: AbstractControl): any {
        const selection: any = control.value
        if (typeof selection === 'string') {
            return { incorrect: true }
        }
        return null
    }

}

export class ConfirmValidParentMatcher {

    isErrorState(control: FormControl | null): boolean {
        return control.parent.invalid && control.touched
    }

}
