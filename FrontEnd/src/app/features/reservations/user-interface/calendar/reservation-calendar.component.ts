import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component } from '@angular/core'
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
    styleUrls: ['./reservation-calendar.component.css'],
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
    public selectedYear: number
    public todayLeftOffset: number
    private fromDate: Date
    private toDate: Date

    // #endregion 

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private sessionStorageService: SessionStorageService) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd && navigation.url == this.url) {
                this.updateVariables()
                this.buildCalendar()
                this.updateCalendar()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setTabTitle()
        this.setLocale()
        this.subscribeToInteractionService()
    }

    //#endregion

    //#region public methods

    public currentYearIsNotDisplayedYear(): boolean {
        return this.dateHelperService.getCurrentYear().toString() != this.sessionStorageService.getItem('year')
    }

    public createNextPeriod(): void {
        this.sessionStorageService.saveItem('fromDate', this.dateHelperService.formatDateToIso(new Date(this.toDate.setDate(this.toDate.getDate() + 1))))
        this.sessionStorageService.saveItem('toDate', this.dateHelperService.formatDateToIso(new Date(this.toDate.setDate(this.toDate.getDate() + 9))))
        this.router.navigate([this.url])
    }

    public createPreviousPeriod(): void {
        const x = this.fromDate.getDate() - 10
        this.sessionStorageService.saveItem('fromDate', this.dateHelperService.formatDateToIso(new Date(this.fromDate.setDate(x))))
        this.sessionStorageService.saveItem('toDate', this.dateHelperService.formatDateToIso(new Date(this.fromDate.setDate(this.fromDate.getDate() + 9))))
        this.router.navigate([this.url])
    }

    public createTodayPeriod(): void {
        this.sessionStorageService.saveItem('fromDate', this.dateHelperService.getCurrentPeriodFromDate())
        this.sessionStorageService.saveItem('toDate', this.dateHelperService.getCurrentPeriodToDate())
        this.router.navigate([this.url])
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
        this.fromDate = new Date(this.fromDate.getFullYear(), month - 1, 1)
        this.sessionStorageService.saveItem('fromDate', this.dateHelperService.formatDateToIso(this.fromDate))
        this.toDate = new Date(this.fromDate.getFullYear(), month - 1, 10)
        this.sessionStorageService.saveItem('toDate', this.dateHelperService.formatDateToIso(this.toDate))
        this.router.navigate([this.url])
    }

    public doReservationTasks(date: string): void {
        this.storeCriteria(date)
        this.navigateToList()
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
        const x = this.fromDate
        while (x <= this.toDate) {
            this.days.push({
                date: this.dateHelperService.formatDateToIso(x),
                weekdayName: x.toLocaleString('default', { weekday: 'short' }),
                value: x.getDate(),
                monthName: x.toLocaleString('default', { month: 'long' }),
                year: '2023'
            })
            x.setDate(x.getDate() + 1)
        }
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

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private setTabTitle(): void {
        this.helperService.setTabTitle(this.feature)
    }

    private storeCriteria(date: string): void {
        this.sessionStorageService.saveItem('date', date)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshDateAdapter.subscribe(() => {
            this.setLocale()
        })
        this.interactionService.refreshTabTitle.subscribe(() => {
            this.setTabTitle()
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

    private updateVariables(): void {
        this.fromDate = new Date(this.sessionStorageService.getItem('fromDate'))
        this.toDate = new Date(this.sessionStorageService.getItem('toDate'))
    }

    //#endregion

}
