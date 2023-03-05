import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { Subject, takeUntil } from 'rxjs'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DayVM } from 'src/app/features/reservations/classes/view-models/calendar/day-vm'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './calendar.component.css']
})

export class CalendarComponent {

    // #region variables

    private unsubscribe = new Subject<void>()
    public feature = 'reservationsCalendar'
    public featureIcon = 'reservations'
    public icon = 'home'
    public parentUrl = '/'
    private records: DayVM[] = []

    private days: any
    private url = '/reservations'
    public activeYear: number
    public activeMonth: number
    public dayWidth: number
    public imgIsLoaded = false
    public isLoading: boolean
    public months: any[]
    public todayScrollPosition: number
    public year: DayVM[] = []

    // #endregion 

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private helperService: HelperService, private interactionService: InteractionService, private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private sessionStorageService: SessionStorageService) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.getActiveYear()
                this.buildCalendar()
                this.updateCalendar()
                this.setLocale()
                this.subscribeToInteractionService()
            }
        })
    }

    //#region lifecycle hooks

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.updateDayVariables()
            this.scrollToTodayOrStoredDate(false)
            this.enableHorizontalScroll()
        }, 500)
    }

    //#endregion

    //#region public methods

    public currentYearIsNotDisplayedYear(): boolean {
        return this.dateHelperService.getCurrentYear().toString() != this.sessionStorageService.getItem('year')
    }

    public dayHasSchedule(day: DayVM): boolean {
        return day.destinations?.length >= 1
    }

    public getIcon(filename: string): string {
        return environment.calendarIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getLocaleMonthName(monthName: string): string {
        return this.messageCalendarService.getDescription('months', monthName)
    }

    public getLocaleWeekdayName(weekdayName: string): string {
        return this.messageCalendarService.getDescription('weekdays', weekdayName)
    }

    public setActiveMonth(month: number): void {
        this.scrollToMonth(month)
        this.storeScrollLeft()
    }

    public gotoReservationsList(date: any): void {
        if (this.dayHasSchedule(date)) {
            this.storeVariables(date.date)
            this.storeScrollLeft()
            this.navigateToList()
        }
    }

    public gotoToday(): void {
        this.scrollToTodayOrStoredDate(true)
    }

    public imageIsLoading(): any {
        return this.imgIsLoaded ? '' : 'skeleton'
    }

    public isSaturday(day: any): boolean {
        return day.weekdayName == 'Sat'
    }

    public isSunday(day: any): boolean {
        return day.weekdayName == 'Sun'
    }

    public isToday(day: any): boolean {
        return day.date == new Date().toISOString().substring(0, 10)
    }

    public loadImage(): void {
        this.imgIsLoaded = true
    }

    public setActiveYear(year: string): void {
        this.saveYear(year)
        if (this.mustRebuildCalendar()) {
            this.router.navigate([this.url])
        }
    }

    //#endregion

    //#region private methods

    private buildCalendar(): void {
        this.year = []
        for (let index = 0; index < 12; index++) {
            const startDate = new Date().setFullYear((this.activeYear), index, 1)
            const endDate = new Date().setFullYear((this.activeYear), index + 1, 0)
            const diffDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24) + 1)
            Object.keys([...Array(diffDays)]).map((a: any) => {
                a = parseInt(a) + 1
                const dayObject = new Date((this.activeYear), index, a)
                this.year.push({
                    date: this.dateHelperService.formatDateToIso(dayObject, false),
                    weekdayName: dayObject.toLocaleString('default', { weekday: 'short' }),
                    value: a,
                    monthName: dayObject.toLocaleString('default', { month: 'long' }),
                    year: this.activeYear.toString()
                })
            })
        }
    }

    private enableHorizontalScroll(): void {
        this.helperService.enableHorizontalScroll(document.querySelector('#days'))
    }

    private getActiveYear(): void {
        this.activeYear = isNaN(parseInt(this.sessionStorageService.getItem('year')))
            ? this.dateHelperService.getCurrentYear()
            : parseInt(this.sessionStorageService.getItem('year'))
    }

    private getMonthOffset(month: number): number {
        return this.dateHelperService.getMonthFirstDayOffset(month, this.activeYear.toString())
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
        if (storedYear != this.activeYear.toString()) {
            this.activeYear = parseInt(storedYear)
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

    private setLocale(): void {
        this.dateAdapter.setLocale(this.sessionStorageService.getLanguage())
    }

    private scrollToMonth(month: number): void {
        this.days.scrollLeft = this.getMonthOffset(month) * this.dayWidth
        document.getElementById(this.activeYear.toString() + '-' + (month.toString().length == 1 ? '0' + month.toString() : month.toString()) + '-' + '01').scrollIntoView()
    }

    private scrollToTodayOrStoredDate(ignoreStoredScrollLeft: boolean): void {
        const scrollLeft = localStorage.getItem('scrollLeft')
        if (ignoreStoredScrollLeft || scrollLeft == null) {
            setTimeout(() => {
                this.todayScrollPosition = this.getTodayLeftScroll() - 2
                this.days.scrollLeft = this.todayScrollPosition * this.dayWidth
                this.sessionStorageService.deleteItems([
                    { 'item': 'scrollLeft', 'when': 'always' }
                ])
            }, 500)
        } else {
            const z = document.getElementById('days')
            z.scrollLeft = parseInt(scrollLeft)
        }
    }

    private storeVariables(date: string): void {
        this.sessionStorageService.saveItem('date', date)
    }

    private storeScrollLeft(): void {
        this.sessionStorageService.saveItem('scrollLeft', document.getElementById('days').scrollLeft.toString())
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
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
            const x = this.year.find(x => x.date == day.date)
            this.year[this.year.indexOf(x)].destinations = day.destinations
            this.year[this.year.indexOf(x)].pax = day.pax
        })
    }

    private updateDayVariables(): void {
        this.days = document.querySelector('#days')
        this.dayWidth = document.querySelectorAll('.day')[0].getBoundingClientRect().width
    }

    //#endregion

}
