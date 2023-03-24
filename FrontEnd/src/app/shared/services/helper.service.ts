import { FormGroup } from '@angular/forms'
import { Injectable } from '@angular/core'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'
import { Router } from '@angular/router'
import { Table } from 'primeng/table'
import { Title } from '@angular/platform-browser'
import { defer, finalize, Observable, Subject } from 'rxjs'
// Custom
import { MessageLabelService } from './messages-label.service'
import { ModalActionResultService } from './modal-action-result.service'
import { SessionStorageService } from './session-storage.service'
import { environment } from 'src/environments/environment'

export function prepare<T>(callback: () => void): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>): Observable<T> => defer(() => {
        callback()
        return source
    })
}

export function indicate<T>(indicator: Subject<boolean>): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>): Observable<T> => source.pipe(
        prepare(() => indicator.next(true)),
        finalize(() => indicator.next(false))
    )
}

@Injectable({ providedIn: 'root' })

export class HelperService {

    //#region variables

    private appName = environment.appName

    //#endregion

    constructor(private messageLabelService: MessageLabelService, private modalActionResultService: ModalActionResultService, private router: Router, private sessionStorageService: SessionStorageService, private titleService: Title) { }

    //#region public methods

    public doPostSaveFormTasks(message: string, iconType: string, returnUrl: string, form: any, formReset = true, goBack = true): Promise<any> {
        const promise = new Promise((resolve) => {
            this.modalActionResultService.open(message, iconType, ['ok']).subscribe(() => {
                formReset ? form.reset() : null
                goBack ? this.router.navigate([returnUrl]) : null
                resolve(null)
            })
        })
        return promise
    }

    public calculateTableWrapperHeight(topBar: string, header: string, footer: string): string {
        return window.innerHeight
            - document.getElementById(topBar).getBoundingClientRect().height
            - document.getElementById(header).getBoundingClientRect().height
            - document.getElementById(footer).getBoundingClientRect().height + 'px'
    }

    public enableOrDisableAutoComplete(event: { key: string }): boolean {
        return (event.key == 'Enter' || event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'ArrowRight' || event.key == 'ArrowLeft') ? true : false
    }

    public formatRefNo(refNo: string, returnsHTML: boolean): string {
        const destination = new RegExp(/[a-zA-Z]{1,5}/).exec(refNo)[0]
        const number = new RegExp(/[0-9]{1,5}/g).exec(refNo).slice(-5)[0]
        const zeros = '00000'.slice(number.length)
        if (returnsHTML)
            return '<span>' + destination.toUpperCase() + '</span>' + '-' + '<span>' + zeros + '</span>' + '<span>' + number + '</span>'
        else
            return destination.toUpperCase() + '-' + zeros + number
    }

    public getApplicationTitle(): any {
        return this.appName
    }

    public getDistinctRecords(records: any[], object: string, orderField = 'description'): any[] {
        const distinctRecords = (Object.values(records.reduce(function (x, item) {
            if (!x[item[object].id]) {
                x[item[object].id] = item[object]
            }
            return x
        }, {})))
        distinctRecords.sort((a, b) => (a[orderField] > b[orderField]) ? 1 : -1)
        return distinctRecords
    }

    public focusOnField(): void {
        setTimeout(() => {
            const input = Array.prototype.slice.apply(document.querySelectorAll('input[data-tabindex]'))[0]
            if (input != null) {
                input.focus()
                input.select()
            }
        }, 500)
    }

    public toggleActiveItem(item: string, lookupArray: string[], className: string): any {
        const element = document.getElementById(item)
        if (element.classList.contains(className)) {
            for (let i = 0; i < lookupArray.length; i++) {
                if ((lookupArray)[i] === item) {
                    lookupArray.splice(i, 1)
                    i--
                    element.classList.remove(className)
                    break
                }
            }
        } else {
            element.classList.add(className)
            lookupArray.push(item)
        }
        return lookupArray
    }

    public enableTableFilters(): void {
        setTimeout(() => {
            const checkboxes = document.querySelectorAll('.p-checkbox, .p-checkbox-box') as NodeListOf<HTMLElement>
            checkboxes.forEach(x => {
                x.classList.remove('disabled')
            })
            const datePickers = document.querySelectorAll('.mat-datepicker-toggle, .mat-datepicker-toggle > .mat-button-base > .mat-button-wrapper') as NodeListOf<HTMLElement>
            datePickers.forEach(x => {
                x.classList.remove('disabled')
            })
            const dropdown = document.querySelectorAll('.p-inputwrapper') as NodeListOf<HTMLElement>
            dropdown.forEach(x => {
                x.classList.remove('disabled')
            })
            const textFilters = document.querySelectorAll('.p-inputtext')
            textFilters.forEach(x => {
                x.classList.remove('disabled')
            })
        }, 500)
    }

    public disableTableFilters(): void {
        setTimeout(() => {
            const checkboxes = document.querySelectorAll('.p-checkbox, .p-checkbox-box') as NodeListOf<HTMLElement>
            checkboxes.forEach(x => {
                x.classList.add('disabled')
            })
            const datePickers = document.querySelectorAll('.mat-datepicker-toggle, .mat-datepicker-toggle > .mat-button-base > .mat-button-wrapper') as NodeListOf<HTMLElement>
            datePickers.forEach(x => {
                x.classList.add('disabled')
            })
            const dropdown = document.querySelectorAll('.p-inputwrapper') as NodeListOf<HTMLElement>
            dropdown.forEach(x => {
                x.classList.add('disabled')
            })
            const textFilters = document.querySelectorAll('.p-inputtext')
            textFilters.forEach(x => {
                x.classList.add('disabled')
            })
        }, 500)
    }

    public clearTableTextFilters(table: Table, inputs: string[]): void {
        table.clear()
        inputs.forEach(input => {
            table.filter('', input, 'contains')
        })
        document.querySelectorAll<HTMLInputElement>('.p-inputtext, .mat-input-element').forEach(box => {
            box.value = ''
        })
    }

    public enableHorizontalScroll(element: any): any {
        element.addEventListener('wheel', (evt: WheelEvent) => {
            evt.preventDefault()
            element.scrollLeft += evt.deltaY
            this.sessionStorageService.saveItem('scrollLeft', element.scrollLeft)
        }, 1000)
    }

    public flattenObject(object: any): any {
        const result = {}
        for (const i in object) {
            if ((typeof object[i]) === 'object' && !Array.isArray(object[i])) {
                const temp = this.flattenObject(object[i])
                for (const j in temp) {
                    result[i + '.' + j] = temp[j]
                }
            }
            else {
                result[i] = object[i]
            }
        }
        return result
    }

    public sortArray(array: any, field: string): any {
        array.sort((a: any, b: any) => {
            if (a[field] < b[field]) {
                return -1
            }
            if (a[field] > b[field]) {
                return 1
            }
            return 0
        })
    }

    public sortNestedArray(array: any, property: any): any {
        property = property.split('.')
        const len = property.length
        array.sort((a: any, b: any) => {
            let i = 0
            while (i < len) { a = a[property[i]]; b = b[property[i]]; i++ }
            if (a < b) {
                return -1
            } else if (a > b) {
                return 1
            } else {
                return 0
            }
        })
    }

    public storeScrollTop(element: string): void {
        setTimeout(() => {
            const body = document.getElementsByClassName(element)[0]
            this.sessionStorageService.saveItem('scrollTop', body.scrollTop.toString())
        }, 1000)
    }

    public deepEqual(object1: any, object2: any): boolean {
        const keys1 = Object.keys(object1)
        const keys2 = Object.keys(object2)
        if (keys1.length !== keys2.length) {
            return false
        }
        for (const key of keys1) {
            const val1 = object1[key]
            const val2 = object2[key]
            const areObjects = this.isObject(val1) && this.isObject(val2)
            if (
                areObjects && !this.deepEqual(val1, val2) ||
                !areObjects && val1 !== val2
            ) {
                return false
            }
        }
        return true
    }

    public highlightRow(id: any): void {
        const allRows = document.querySelectorAll('.p-highlight')
        allRows.forEach(row => {
            row.classList.remove('p-highlight')
        })
        const selectedRow = document.getElementById(id)
        selectedRow.classList.add('p-highlight')
    }

    public highlightSavedRow(feature: string): void {
        setTimeout(() => {
            const x = document.getElementById(this.sessionStorageService.getItem(feature + '-' + 'id'))
            if (x != null) {
                x.classList.add('p-highlight')
            }
        }, 500)
    }

    public unHighlightAllRows(): void {
        const x = document.querySelectorAll('.p-highlight')
        x.forEach(row => {
            row.classList.remove('p-highlight')
        })
    }

    public clearTableCheckboxes(): void {
        setTimeout(() => {
            const x = document.querySelectorAll('tr td .p-element .p-checkbox .p-checkbox-box .p-checkbox-icon.pi')
            x.forEach(row => {
                row.classList.remove('pi-check')
            })
        }, 100)
    }

    public toggleVirtualTable(isVirtual: boolean): any {
        setTimeout(() => {
            return !isVirtual
        }, 300)
    }

    public clearStyleFromVirtualTable(): void {
        const x = document.getElementsByClassName('p-scroller-content') as HTMLCollectionOf<HTMLElement>
        x[0].style.transform = null
    }

    public scrollToSavedPosition(virtualElement: any, feature: string): void {
        if (virtualElement != undefined) {
            setTimeout(() => {
                virtualElement.scrollTo({
                    top: parseInt(this.sessionStorageService.getItem(feature + '-scrollTop')) || 0,
                    left: 0,
                    behavior: 'auto'
                })
            }, 500)
        }
    }

    public openOrCloseAutocomplete(form: FormGroup<any>, element: any, trigger: MatAutocompleteTrigger): void {
        form.get(element).patchValue('')
        trigger.panelOpen ? trigger.closePanel() : trigger.openPanel()
    }

    public goBackFromForm(form: FormGroup<any>): any {
        form.reset()
        setTimeout(() => {
            return true
        }, 1000)
    }

    public setWindowWidth(element: string): void {
        const x = document.getElementById(element)
        if (typeof (x) != 'undefined' && x != null) {
            x.style.width = window.innerWidth + 'px'
        }
    }

    public setTabTitle(feature: string): void {
        this.titleService.setTitle(environment.appName + ': ' + this.messageLabelService.getDescription(feature, 'header'))
    }

    /**
     * Calculates how many day divs should be created, according to the host container width
    */
    public calculateDayCount(): number {
        const elementWidth = window.innerWidth - environment.marginsInPixels
        const dayCount = Math.trunc(elementWidth / 123.2)
        return dayCount
    }

    //#endregion

    //#region private methods

    public getLabel(feature: string, id: string): string {
        return this.messageLabelService.getDescription(feature, id)
    }

    private isObject(object: any): boolean {
        return object != null && typeof object === 'object'
    }

    //#endregion

}