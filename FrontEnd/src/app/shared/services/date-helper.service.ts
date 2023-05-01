import { Injectable } from '@angular/core'
// Custom
import { LocalStorageService } from './local-storage.service'
import { MessageCalendarService } from 'src/app/shared/services/message-calendar.service'

@Injectable({ providedIn: 'root' })

export class DateHelperService {

    constructor(private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService) { }

    //#region public methods

    /**
     * Formats a 'YYYY-MM-DD' string into a string according to the stored locale with optional weekday name and year
     * Example '2022-12-14' with selected locale Greek, showWeekday = true and showYear = false will return 'Τετ 14/12'
     * @param date: String representing a date formatted as 'YYYY-MM-DD'
     * @param showWeekday: An optional boolean whether to include the weekday in the return string
     * @param showYear: An optional boolean whether to include the year in the return string
     */
    public formatISODateToLocale(date: string, showWeekday = false, showYear = true): string {
        const parts = date.split('-')
        const rawDate = new Date(date)
        const dateWithLeadingZeros = this.addLeadingZerosToDateParts(new Intl.DateTimeFormat(this.localStorageService.getLanguage()).format(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))), showYear)
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

    /**
     * Returns the weekday index (0=Sun, 1=Mon, 2=Tue, ..., 6=Sat) of a 'YYYY-MM-DD' string 
     * @param date a string representing a date formatted as 'YYYY-MM-DD'
     * @returns an integer representing the weekday index
     */
    public getWeekdayIndex(date: string): any {
        const [year, month, day] = date.split('-')
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getDay()
    }

    /**
     * @returns a string representing today formatted as 'YYYY-MM-DD'
     */
    public getCurrentPeriodBeginDate(): string {
        const today = new Date()
        return this.formatDateToIso(new Date(today.setDate(today.getDate() - 1)))
    }

    /**
     * @param dayCount an integer representing the days to create into the future based on today
     * @returns a string representing the future date formatted as 'YYYY-MM-DD'
     */
    public getCurrentPeriodEndDate(dayCount: number): string {
        const today = new Date()
        return this.formatDateToIso(new Date(today.setDate(today.getDate() + dayCount - 2)))
    }

    /**
     * @param fromDate the date object representing the date to begin
     * @param days how many days to create
     * @returns a date object representing a future date based on the fromDate and the days count
     */
    public getPeriodEndDate(fromDate: Date, days: number): string {
        const newDate = new Date(fromDate)
        newDate.setDate(newDate.getDate() + days - 1)
        return this.formatDateToIso(newDate)
    }

    /**
     * Gets a 'YYYY-MM-DD' string and returns a date object formatted as 'Thu Mar 23 2023 00:00:00'
     * @param date a string representing a date
     * @returns a date object
     */
    public createDateFromString(date: string): Date {
        const day = date.substring(8, 10)
        const month = date.substring(5, 7)
        const year = date.substring(0, 4)
        return new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day), 0, 0, 0, 0)
    }

    /**
     * Subtracts 100 years if the given year is in the future
     * Solves the problem where 1.1.40 becomes 1.1.2040 instead of 1.1.1940
     * @param date a moment.js object
     * @returns a moment.js object
     */
    public gotoPreviousCenturyIfFutureDate(date: any): Date {
        // const given = date
        const today = new Date()
        // const past = given
        if (date > today) {
            return date.add(-100, 'years')
        } else {
            return date
        }
    }

    //#endregion

    //#region private methods

    /**
     * 
     * @param date a string representing a date possibly formatted as 'YYYY-M-D'
     * @param showYear include the year in the return string or not
     * @returns a string representing a date formatted as 'YYYY-MM-DD'
     */
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

    /**
     * @returns a string representing the date seperator based on the stored locale
     */
    private getDateLocaleSeperator(): string {
        switch (this.localStorageService.getLanguage()) {
            case 'cs-CZ': return '.'
            case 'de-DE': return '.'
            case 'el-GR': return '/'
            case 'en-GB': return '/'
            case 'fr-FR': return '/'
        }
    }

    //#endregion

}
