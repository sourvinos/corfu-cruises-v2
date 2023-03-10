import { Injectable } from '@angular/core'
// Custom
import { MessageCalendarService } from 'src/app/shared/services/messages-calendar.service'
import { SessionStorageService } from './session-storage.service'

@Injectable({ providedIn: 'root' })

export class DateHelperService {

    constructor(private messageCalendarService: MessageCalendarService, private sessionStorageService: SessionStorageService) { }

    //#region public methods

    /**
     * Formats a 'YYYY-MM-DD' string into a string according to the current locale with optional weekday name and year
     * Example '2022-12-14' with selected locale Greek, showWeekday = true and showYear = false will return 'Τετ 14/12'
     * @param date: String representing a date formatted as 'YYYY-MM-DD'
     * @param showWeekday: An optional boolean whether to include the weekday in the return string
     * @param showYear: An optional boolean whether to include the year in the return string
     */
    public formatISODateToLocale(date: string, showWeekday = false, showYear = true): string {
        const parts = date.split('-')
        const rawDate = new Date(date)
        const dateWithLeadingZeros = this.addLeadingZerosToDateParts(new Intl.DateTimeFormat(this.sessionStorageService.getLanguage()).format(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))), showYear)
        const weekday = this.messageCalendarService.getDescription('weekdays', rawDate.getDay().toString())
        return showWeekday ? weekday + ' ' + dateWithLeadingZeros : dateWithLeadingZeros
    }

    /**
     * Formats a date formatted as "Tue Nov 01 2022" into a string formatted as "2022-11-01" with optional weekday name
     * @param date: Date formatted as "Tue Nov 01 2022"
     * @param includeWeekday: An optional boolean whether to include the weekday in the return string
     * @returns String formatted as "YYYY-MM-DD" or "Tue YYYY-MM-DD"
    */
    public formatDateToIso(date: Date, includeWeekday = false): string {
        let day = date.getDate().toString()
        let month = (date.getMonth() + 1).toString()
        const year = date.getFullYear()
        const weekday = date.toLocaleString('default', { weekday: 'short' })
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        const formattedDate = [year, month, day].join('-')
        return includeWeekday ? weekday + ' ' + formattedDate : formattedDate
    }

    public getCurrentMonth(): number {
        return new Date().getMonth()
    }

    public getCurrentYear(): number {
        return new Date().getFullYear()
    }

    public getMonthFirstDayOffset(month: number, year: string): number {
        const isLeapYear = this.isLeapYear(parseInt(year))
        switch (month) {
            case 1: return 0
            case 2: return 31
            case 3: return isLeapYear ? 60 : 59
            case 4: return isLeapYear ? 91 : 90
            case 5: return isLeapYear ? 121 : 120
            case 6: return isLeapYear ? 152 : 151
            case 7: return isLeapYear ? 182 : 181
            case 8: return isLeapYear ? 213 : 212
            case 9: return isLeapYear ? 244 : 243
            case 10: return isLeapYear ? 274 : 273
            case 11: return isLeapYear ? 305 : 304
            case 12: return isLeapYear ? 335 : 334
        }
    }

    public isLeapYear(year: number): boolean {
        return (0 == year % 4) && (0 != year % 100) || (0 == year % 400) ? true : false
    }

    //#endregion

    //#region private methods

    private addLeadingZerosToDateParts(date: string, showYear: boolean): string {
        const seperator = this.getDateLocaleSeperator()
        const parts = date.split(seperator)
        parts[0].replace(' ', '').length == 1 ? parts[0] = '0' + parts[0].replace(' ', '') : parts[0]
        parts[1].replace(' ', '').length == 1 ? parts[1] = '0' + parts[1].replace(' ', '') : parts[1]
        parts[2] = parts[2].replace(' ', '')
        if (showYear) {
            return parts[0] + seperator + parts[1] + seperator + parts[2]
        } else {
            return parts[0] + seperator + parts[1]
        }
    }

    private getDateLocaleSeperator(): string {
        switch (this.sessionStorageService.getLanguage()) {
            case 'cs-CZ': return '.'
            case 'de-DE': return '.'
            case 'el-GR': return '/'
            case 'en-GB': return '/'
            case 'fr-FR': return '/'
        }
    }

    //#endregion

}
