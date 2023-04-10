import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component, HostListener } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DayVM } from 'src/app/features/reservations/classes/view-models/calendar/day-vm'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/message-calendar.service'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { MessageDialogService } from 'src/app/shared/services/message-dialog.service'
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
    public parentUrl = '/home'

    public days: DayVM[] = []
    public fromDate: Date
    public toDate: Date
    public isSizeChanged = false

    // #endregion 

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private dialogService: DialogService, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageDialogService, private modalActionResultService: ModalActionResultService, private router: Router, private sessionStorageService: SessionStorageService) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd && navigation.url == this.url) {
                this.updateVariables()
                this.buildCalendar()
                this.updateCalendar()
            }
        })
    }

    //#region listeners

    @HostListener('window:resize', ['$event']) onResize(): void {
        this.storeDatePeriod().then(() => {
            this.isSizeChanged = true
        })
    }

    //#endregion

    //#region lifecycle hooks

    ngOnInit(): void {
        this.setTabTitle()
        this.setLocale()
        this.subscribeToInteractionService()
        this.clearSessionStorage()
    }

    //#endregion

    //#region public methods

    public askToRefreshCalendar(): void {
        this.dialogService.open(this.messageSnackbarService.askToRefreshCalendar(), 'warning', 'right-buttons', ['abort', 'ok']).subscribe(response => {
            if (response) {
                this.isSizeChanged = false
                this.router.navigate([this.url])
            }
        })
    }

    public dayHasSchedule(day: DayVM): boolean {
        return day.destinations?.length >= 1
    }

    public doSelectedPeriodTasks(identifier: string): void {
        const period = this.createPeriod(identifier)
        this.sessionStorageService.saveItem('fromDate', period[0])
        this.sessionStorageService.saveItem('toDate', period[1])
        this.router.navigate([this.url])
    }

    public doReservationTasks(date: string): void {
        this.storeCriteria(date)
        this.navigateToList()
    }

    public doTasksAfterMonthSelection(month: number): void {
        this.fromDate = new Date(this.fromDate.getFullYear(), month - 1, 1)
        this.sessionStorageService.saveItem('fromDate', this.dateHelperService.formatDateToIso(this.fromDate))
        this.toDate = new Date(this.fromDate.getFullYear(), month - 1, parseInt(this.sessionStorageService.getItem('dayCount')))
        this.sessionStorageService.saveItem('toDate', this.dateHelperService.formatDateToIso(this.toDate))
        this.router.navigate([this.url])
    }

    public doTasksAfterYearSelection(event: any): void {
        this.sessionStorageService.saveItem('fromDate', event + '-' + '01' + '-' + '01')
        this.sessionStorageService.saveItem('toDate', event + '-' + '01' + '-' + this.sessionStorageService.getItem('dayCount'))
        this.router.navigate([this.url])
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getLocaleMonthName(date: string): string {
        return this.messageCalendarService.getDescription('months', date.substring(5, 7))
    }

    public getLocaleWeekdayName(date: string): string {
        return this.messageCalendarService.getDescription('weekdays', new Date(date).getDay().toString())
    }

    public getSelectedYear(): string {
        return this.fromDate.getFullYear().toString()
    }

    public getYear(date: string): string {
        return date.substring(0, 4)
    }

    public isSaturday(date: any): boolean {
        return this.dateHelperService.getWeekdayIndex(date) == 6
    }

    public isSunday(date: any): boolean {
        return this.dateHelperService.getWeekdayIndex(date) == 0
    }

    public isToday(date: any): boolean {
        return date == new Date().toISOString().substring(0, 10)
    }

    public newRecord(): void {
        this.sessionStorageService.saveItem('returnUrl', '/reservations')
        this.router.navigate(['/reservations/new'])
    }

    //#endregion

    //#region private methods

    private buildCalendar(): void {
        this.days = []
        const x = this.dateHelperService.createDateFromString(this.sessionStorageService.getItem('fromDate'))
        const z = this.dateHelperService.createDateFromString(this.sessionStorageService.getItem('toDate'))
        while (x <= z) {
            this.days.push({
                date: this.dateHelperService.formatDateToIso(x),
                weekdayName: x.toLocaleString('default', { weekday: 'short' }),
                value: x.getDate(),
                monthName: x.toLocaleString('default', { month: 'long' })
            })
            x.setDate(x.getDate() + 1)
        }
    }

    private clearSessionStorage(): void {
        this.sessionStorageService.deleteItems([
            { 'item': 'reservationList-id', 'when': 'always' },
            { 'item': 'reservationList-scrollTop', 'when': 'always' },
            { 'item': 'date', 'when': 'always' },
            { 'item': 'destination', 'when': 'always' },
            { 'item': 'returnUrl', 'when': 'always' }
        ])
    }

    private createPeriod(identifier: string): any {
        switch (identifier) {
            case 'next': {
                const period = []
                period[0] = this.dateHelperService.formatDateToIso(new Date(this.toDate.setDate(this.toDate.getDate() + 1)))
                period[1] = this.dateHelperService.formatDateToIso(new Date(this.toDate.setDate(this.toDate.getDate() + parseInt(this.sessionStorageService.getItem('dayCount')) - 1)))
                return period
            }
            case 'previous': {
                const period = []
                period[0] = this.dateHelperService.formatDateToIso(new Date(this.fromDate.setDate(this.fromDate.getDate() - parseInt(this.sessionStorageService.getItem('dayCount')))))
                period[1] = this.dateHelperService.formatDateToIso(new Date(this.fromDate.setDate(this.fromDate.getDate() + parseInt(this.sessionStorageService.getItem('dayCount')) - 1)))
                return period
            }
            case 'today': {
                const period = []
                period[0] = this.dateHelperService.getCurrentPeriodBeginDate()
                period[1] = this.dateHelperService.getCurrentPeriodEndDate(parseInt(this.sessionStorageService.getItem('dayCount')))
                return period
            }
        }
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

    private navigateToList(): void {
        this.sessionStorageService.saveItem('returnUrl', '/reservations')
        this.router.navigate(['reservations/date/', this.sessionStorageService.getItem('date')])
    }

    private setLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private setTabTitle(): void {
        this.helperService.setTabTitle(this.feature)
    }

    private storeDatePeriod(): Promise<void> {
        return new Promise((resolve) => {
            this.sessionStorageService.saveItem('dayCount', this.helperService.calculateDayCount().toString())
            this.sessionStorageService.saveItem('toDate', this.dateHelperService.getPeriodEndDate(new Date(this.sessionStorageService.getItem('fromDate')), parseInt(this.sessionStorageService.getItem('dayCount'))))
            resolve()
        })
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