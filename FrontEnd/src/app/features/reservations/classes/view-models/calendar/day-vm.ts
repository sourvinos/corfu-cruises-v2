import { DestinationVM } from './destination-vm'

export interface DayVM {

    date: string,
    weekdayName: string,
    value: number,
    monthName: string,
    year: string,
    pax?: number,
    destinations?: DestinationVM[]

}

