import { Component, EventEmitter, Output } from '@angular/core'

@Component({
    selector: 'month-selector',
    templateUrl: './month-selector.component.html',
    styleUrls: ['./month-selector.component.css']
})

export class MonthSelectorComponent {

    //#region variables

    @Output() public monthEmitter = new EventEmitter()

    public months: number[] = []

    //#endregion

    //#region lifecycle hooks

    ngOnInit(): void {
        this.populateMonths()
    }

    //#endregion

    //#region public methods

    public hideMenu(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.add('hidden')
        })
    }

    public selectMonth(month: number): any {
        this.monthEmitter.emit(month)
    }

    //#endregion

    //#region private methods

    private populateMonths(): void {
        for (let month = 1; month < 13; month++) {
            this.months.push(month)
        }
    }

    //#endregion

}