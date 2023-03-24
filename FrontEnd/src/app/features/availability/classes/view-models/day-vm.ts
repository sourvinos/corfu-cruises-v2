import { DestinationViewModel } from './destination-view-model'

export interface DayVM {

    date: string
    weekdayName: string,
    value: number,
    monthName: string,
    pax?: number

    destinations: DestinationViewModel[]

}

