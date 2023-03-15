import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DayVM } from 'src/app/features/reservations/classes/view-models/calendar/day-vm'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'

@Component({
    selector: 'calendar',
    templateUrl: './reservation-calendar.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './reservation-calendar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class ReservationCalendarComponent {

    // #region variables

    private records: DayVM[] = []
    private url = '/reservations'
    public feature = 'reservationsCalendar'
    public featureIcon = 'reservations'
    public icon = 'home'
    public parentUrl = '/'

    private daysWrapper: any
    public dayWidth: number
    public days: DayVM[] = []
    public daysObservable = new BehaviorSubject(this.days)
    public selectedYear: number
    public todayLeftOffset: number

    // #endregion 

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private sessionStorageService: SessionStorageService) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd && navigation.url == this.url) {
                this.setYear()
                this.buildCalendar()
                this.updateCalendar()
                setTimeout(() => {
                    this.updateDayVariables()
                    this.scrollToStoredDate()
                    this.scrollToToday(false)
                    this.setLocale()
                    this.subscribeToInteractionService()
                    this.setCalendarWidth()
                }, 1000)
            }
        })
    }

    //#region listeners
    @HostListener('window:resize', ['$event']) onResize(): void {
        this.setCalendarWidth()
    }

    //#endregion

    //#region lifecycle hooks

    ngAfterViewInit(): void {
        this.enableHorizontalScroll()
    }

    //#endregion

    //#region public methods

    public currentYearIsNotDisplayedYear(): boolean {
        return this.dateHelperService.getCurrentYear().toString() != this.sessionStorageService.getItem('year')
    }

    public dayHasSchedule(day: DayVM): boolean {
        return day.destinations?.length >= 1
    }

    public doTasksAfterYearSelection(event: any): void {
        this.selectedYear = parseInt(event)
        this.sessionStorageService.saveItem('year', event)
        this.router.navigate([this.url])
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getLocaleMonthName(day: any): string {
        return this.messageCalendarService.getDescription('months', day.date.substring(5, 7))
    }

    public getLocaleWeekdayName(day: any): string {
        return this.messageCalendarService.getDescription('weekdays', new Date(day.date).getDay().toString())
    }

    public getYear(day: any): string {
        return day.year
    }

    public setActiveMonth(month: number): void {
        this.scrollToMonth(month)
        this.storeScrollLeft()
    }

    public doReservationTasks(date: string): void {
        this.storeCriteria(date)
        this.storeScrollLeft()
        this.navigateToList()
    }

    public gotoToday(): void {
        this.scrollToToday(true)
    }

    public isSaturday(day: any): boolean {
        return this.dateHelperService.getWeekdayIndex(day) == 6
    }

    public isSunday(day: any): boolean {
        return this.dateHelperService.getWeekdayIndex(day) == 0
    }

    public isToday(day: any): boolean {
        return day.date == new Date().toISOString().substring(0, 10)
    }

    public setSelectedYear(year: string): void {
        this.saveYear(year)
        if (this.mustRebuildCalendar()) {
            this.router.navigate([this.url])
        }
    }

    //#endregion

    //#region private methods

    private buildCalendar(): void {
        this.days = []
        this.daysObservable.next(this.days)
        for (let index = 0; index < 12; index++) {
            const startDate = new Date().setFullYear((this.selectedYear), index, 1)
            const endDate = new Date().setFullYear((this.selectedYear), index + 1, 0)
            const diffDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24) + 1)
            Object.keys([...Array(diffDays)]).map((a: any) => {
                a = parseInt(a) + 1
                const dayObject = new Date((this.selectedYear), index, a)
                this.days.push({
                    date: this.dateHelperService.formatDateToIso(dayObject, false),
                    weekdayName: dayObject.toLocaleString('default', { weekday: 'short' }),
                    value: a,
                    monthName: dayObject.toLocaleString('default', { month: 'long' }),
                    year: this.selectedYear.toString()
                })
            })
        }
    }

    private enableHorizontalScroll(): void {
        setTimeout(() => {
            this.helperService.enableHorizontalScroll(document.querySelector('.cdk-virtual-scrollable'))
        }, 500)
    }

    private getMonthOffset(month: number): number {
        return this.dateHelperService.getMonthFirstDayOffset(month, this.selectedYear.toString())
    }

    private getReservations(): Promise<any> {
        const promise = new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error == null) {
                this.records = listResolved.list
                resolve(this.records)
            } else {
                this.goBack()
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
            }
        })
        return promise
    }

    private getTodayLeftScroll(): number {
        const date = new Date()
        const fromDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        const toDate = Date.UTC(date.getFullYear(), 0, 0)
        const differenceInMilliseconds = fromDate - toDate
        const differenceInDays = differenceInMilliseconds / 1000 / 60 / 60 / 24
        return differenceInDays
    }

    private goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    private mustRebuildCalendar(): boolean {
        const storedYear = this.sessionStorageService.getItem('year')
        if (storedYear != this.selectedYear.toString()) {
            this.selectedYear = parseInt(storedYear)
            return true
        }
        return false
    }

    private navigateToList(): void {
        this.router.navigate(['reservations/date/', this.sessionStorageService.getItem('date')])
    }

    private saveYear(year?: string): void {
        this.sessionStorageService.saveItem('year', year
            ? year
            : this.dateHelperService.getCurrentYear().toString())
    }

    private setCalendarWidth(): void {
        document.getElementById('table-wrapper').style.width = window.innerWidth - 64 + 'px'
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private setYear(): void {
        this.selectedYear = parseInt(this.sessionStorageService.getItem('year'))
    }

    private scrollToMonth(month: number): void {
        this.daysWrapper.scrollLeft = this.getMonthOffset(month) * this.dayWidth
        document.getElementById(this.selectedYear.toString() + '-' + (month.toString().length == 1 ? '0' + month.toString() : month.toString()) + '-' + '01').scrollIntoView()
    }

    private scrollToStoredDate(): void {
        const scrollLeft = sessionStorage.getItem('scrollLeft')
        const days = document.getElementById('days')
        if (scrollLeft != null) {
            days.scrollLeft = parseInt(scrollLeft)
        } else {
            days.scrollLeft = 0
            this.sessionStorageService.saveItem('scrollLeft', this.daysWrapper.scrollLeft)
        }
    }

    private scrollToToday(ignoreStoredLeft: boolean): void {
        if (this.dateHelperService.getCurrentYear().toString() == this.sessionStorageService.getItem('year') && (this.sessionStorageService.getItem('scrollLeft') == '0' || ignoreStoredLeft)) {
            this.todayLeftOffset = this.getTodayLeftScroll() - 2
            this.daysWrapper.scrollLeft = this.todayLeftOffset * this.dayWidth
            this.sessionStorageService.saveItem('scrollLeft', this.daysWrapper.scrollLeft)
        }
    }

    private storeCriteria(date: string): void {
        this.sessionStorageService.saveItem('date', date)
    }

    private storeScrollLeft(): void {
        this.sessionStorageService.saveItem('scrollLeft', document.getElementById('days').scrollLeft.toString())
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.subscribe(() => {
            this.setLocale()
        })
    }

    private updateCalendar(): void {
        this.getReservations().then(() => {
            this.updateCalendarWithReservations()
        })
    }

    private updateCalendarWithReservations(): void {
        this.records.forEach(day => {
            const x = this.days.find(x => x.date == day.date)
            if (x != undefined) {
                this.days[this.days.indexOf(x)].destinations = day.destinations
                this.days[this.days.indexOf(x)].pax = day.pax
            }
        })
    }

    private updateDayVariables(): void {
        this.daysWrapper = document.querySelector('#days')
        this.dayWidth = document.querySelectorAll('.day')[0].getBoundingClientRect().width
    }

    //#endregion

}
