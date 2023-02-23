import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
import { Subscription } from 'rxjs'
// Custom
import { DateAdapter } from '@angular/material/core'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DayVM } from '../classes/view-models/day-vm'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { MessageLabelService } from './../../../shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'

@Component({
    selector: 'availability',
    templateUrl: './availability.component.html',
    styleUrls: ['../../../../assets/styles/lists.css', './availability.component.css']
})

export class AvailabilityComponent {

    // #region variables

    private subscription = new Subscription()
    private url = '/availability'
    public feature = 'availabilityCalendar'
    public featureIcon = 'availability'
    public icon = 'home'
    public parentUrl = '/'
    private records: DayVM[] = []

    private days: any
    public activeYear: number
    public dayWidth: number
    public todayScrollPosition: number
    public year: DayVM[] = []

    // #endregion 

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router,) {
        this.subscription = this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                if (navigation.url == this.url) {
                    this.doActiveYearTasks()
                    this.buildCalendar()
                    this.updateCalendar()
                }
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setLocale()
        this.subscribeToInteractionService()
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.updateDayVariables()
            this.scrollToTodayOrStoredDate(false)
            this.enableHorizontalScroll()
        }, 500)
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    private cleanup(): void {
        this.subscription.unsubscribe()
    }

    //#endregion 

    //#region public methods

    public currentYearIsNotDisplayedYear(): boolean {
        return this.dateHelperService.getCurrentYear().toString() != this.localStorageService.getItem('activeYearAvailability')
    }

    public dayHasSchedule(day: DayVM): boolean {
        return day.destinations?.length >= 1
    }

    public doActiveYearTasks(year?: any): void {
        if (year == undefined) {
            const storedYear = parseInt(this.localStorageService.getItem('activeYearAvailability'))
            if (isNaN(storedYear)) {
                this.activeYear = this.dateHelperService.getCurrentYear()
                this.localStorageService.saveItem('activeYearAvailability', this.activeYear.toString())
            } else {
                this.activeYear = storedYear
            }
        } else {
            if (year != this.getActiveYear) {
                this.activeYear = parseInt(year)
                this.localStorageService.saveItem('activeYearAvailability', this.activeYear.toString())
                this.router.navigate([this.url])
            }
        }
    }

    public doReservationTasks(date: string, destinationId: number, destinationDescription: string): void {
        this.storeCriteria(date, destinationId, destinationDescription)
        this.navigateToNewReservation()
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public gotoToday(): void {
        this.scrollToTodayOrStoredDate(true)
    }

    public isSaturday(day: any): boolean {
        return new Date(day.date).getDay() == 6
    }

    public isSunday(day: any): boolean {
        return new Date(day.date).getDay() == 0
    }

    public isToday(day: any): boolean {
        return day.date == new Date().toISOString().substring(0, 10)
    }

    public navigateToNewReservation(): void {
        setTimeout(() => { this.router.navigate(['/reservations/new']) }, 500)
    }

    public setActiveMonth(month: number): void {
        this.scrollToMonth(month)
        this.storeScrollLeft()
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
                    year: this.activeYear.toString(),
                    destinations: []
                })
            })
        }
    }

    private enableHorizontalScroll(): void {
        this.helperService.enableHorizontalScroll(document.querySelector('#days'))
    }

    private getActiveYear(): void {
        this.activeYear = isNaN(parseInt(this.localStorageService.getItem('activeYearAvailability')))
            ? this.dateHelperService.getCurrentYear()
            : parseInt(this.localStorageService.getItem('activeYearAvailability'))
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

    public getLocaleMonthName(monthName: string): string {
        return this.messageCalendarService.getDescription('months', monthName)
    }

    public getLocaleWeekdayName(weekdayName: string): string {
        return this.messageCalendarService.getDescription('weekdays', weekdayName)
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
                this.localStorageService.deleteItems([
                    { 'item': 'scrollLeft', 'when': 'always' }
                ])
            }, 500)
        } else {
            const z = document.getElementById('days')
            z.scrollLeft = parseInt(scrollLeft)
        }
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private storeCriteria(date: string, destinationId: number, destinationDescription: string): void {
        this.localStorageService.saveItem('date', date)
        this.localStorageService.saveItem('destinationId', destinationId.toString())
        this.localStorageService.saveItem('destinationDescription', destinationDescription.toString())
        this.localStorageService.saveItem('returnUrl', '/availability')
    }

    private storeScrollLeft(): void {
        this.localStorageService.saveItem('scrollLeft', document.getElementById('days').scrollLeft.toString())
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

    private updateDayVariables(): void {
        this.days = document.querySelector('#days')
        this.dayWidth = document.querySelectorAll('.day')[0].getBoundingClientRect().width
    }

    private updateCalendarWithReservations(): void {
        this.records.forEach(day => {
            const x = this.year.find(x => x.date == day.date)
            if (x != undefined) {
                this.year[this.year.indexOf(x)].destinations = day.destinations
            }
        })
    }

    //#endregion

}
