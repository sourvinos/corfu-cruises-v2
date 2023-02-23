import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { DateRange, MatCalendar } from '@angular/material/datepicker'
// Custom
import { EmojiService } from '../../services/emoji.service'
import { MessageLabelService } from '../../services/messages-label.service'

@Component({
    selector: 'date-range-selector',
    templateUrl: './date-range-selector.component.html',
    styleUrls: ['./date-range-selector.component.css']
})

export class DateRangeSelectorComponent {

    //#region variables

    @ViewChild('calendar', { static: false }) calendar: MatCalendar<Date>
    @Input() allowSingleDate: boolean
    @Input() selectedRangeValue: DateRange<Date>
    @Output() selectedRangeValueChange = new EventEmitter<DateRange<Date>>()

    private feature = 'mat-calendar'

    //#endregion

    constructor(private emojiService: EmojiService, private messageLabelService: MessageLabelService) { }

    //#region public methods

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public gotoToday(): void {
        this.selectedRangeValue = new DateRange<Date>(new Date(), new Date())
        this.selectedRangeValueChange.emit(this.selectedRangeValue)
        this.calendar._goToDateInView(new Date(), 'month')
    }

    public selectedChange(m: any): void {
        this.allowSingleDate ? this.processSingleDate(m) : this.processDateRange(m)
    }

    private processSingleDate(m: any): void {
        this.selectedRangeValue = new DateRange<Date>(m, m)
        this.selectedRangeValueChange.emit(this.selectedRangeValue)
    }

    private processDateRange(m: any): void {
        if (!this.selectedRangeValue?.start || this.selectedRangeValue?.end) {
            this.selectedRangeValue = new DateRange<Date>(m, null)
        } else {
            const start = this.selectedRangeValue.start
            const end = m
            if (end < start) {
                this.selectedRangeValue = new DateRange<Date>(end, start)
            } else {
                this.selectedRangeValue = new DateRange<Date>(start, end)
            }
        }
        this.selectedRangeValueChange.emit(this.selectedRangeValue)
    }

    //#endregion

}