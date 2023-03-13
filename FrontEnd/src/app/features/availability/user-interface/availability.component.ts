import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
// Custom
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
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

@Component({
    selector: 'availability',
    templateUrl: './availability.component.html',
    styleUrls: ['../../../../assets/styles/lists.css', './availability.component.css']
})

export class AvailabilityComponent {

    // #region variables

    private records: DayVM[] = []
    private url = '/availability'
    public feature = 'availabilityCalendar'
    public featureIcon = 'availability'
    public icon = 'home'
    public parentUrl = '/'

    private daysWrapper: any
    public activeYear: number
    public dayWidth: number
    public days: DayVM[] = []
    public todayScrollPosition: number

    // #endregion 

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private sessionStorageService: SessionStorageService,) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd && navigation.url == this.url) {
                this.setYear()
                this.buildCalendar()
                this.updateCalendar()
                setTimeout(() => {
                    this.updateDayVariables()
                    this.scrollToToday()
                    this.setLocale()
                    this.subscribeToInteractionService()
                }, 1000)
            }
        })
    }

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
        this.activeYear = parseInt(event)
        this.sessionStorageService.saveItem('year', event)
        this.router.navigate([this.url])
    }

    public doReservationTasks(date: string, destination: SimpleEntity): void {
        this.storeCriteria(date, destination)
        this.storeScrollLeft()
        this.navigateToNewReservation()
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

    public gotoToday(): void {
        this.scrollToToday()
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
    }

    //#endregion

    //#region private methods

    private buildCalendar(): void {
        this.days = []
        for (let index = 0; index < 12; index++) {
            const startDate = new Date().setFullYear((this.activeYear), index, 1)
            const endDate = new Date().setFullYear((this.activeYear), index + 1, 0)
            const diffDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24) + 1)
            Object.keys([...Array(diffDays)]).map((a: any) => {
                a = parseInt(a) + 1
                const dayObject = new Date((this.activeYear), index, a)
                this.days.push({
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
        setTimeout(() => {
            this.helperService.enableHorizontalScroll(document.querySelector('#days'))
        }, 500)
    }

    private getMonthOffset(month: number): number {
        return this.dateHelperService.getMonthFirstDayOffset(month, this.activeYear.toString())
    }

    private getReservations(): Promise<any> {
        return new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error == null) {
                this.records = listResolved.list
                resolve(this.records)
            } else {
                this.goBack()
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
            }
        })
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
        this.daysWrapper.scrollLeft = this.getMonthOffset(month) * this.dayWidth
        document.getElementById(this.activeYear.toString() + '-' + (month.toString().length == 1 ? '0' + month.toString() : month.toString()) + '-' + '01').scrollIntoView()
    }

    private scrollToToday(): void {
        if (this.dateHelperService.getCurrentYear() == this.activeYear) {
            this.todayScrollPosition = this.getTodayLeftScroll() - 2
            this.daysWrapper.scrollLeft = this.todayScrollPosition * this.dayWidth
        }
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private setYear(): void {
        this.activeYear = parseInt(this.sessionStorageService.getItem('year'))
    }

    private storeCriteria(date: string, destination: SimpleEntity): void {
        this.sessionStorageService.saveItem('date', date)
        this.sessionStorageService.saveItem('destination', JSON.stringify({
            'id': destination.id,
            'description': destination.description
        }))
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

    private updateDayVariables(): void {
        this.daysWrapper = document.querySelector('#days')
        this.dayWidth = document.querySelectorAll('.day')[0].getBoundingClientRect().width
    }

    private updateCalendarWithReservations(): void {
        this.records.forEach(day => {
            const x = this.days.find(x => x.date == day.date)
            if (x != undefined) {
                this.days[this.days.indexOf(x)].destinations = day.destinations
            }
        })
    }

    //#endregion

}
