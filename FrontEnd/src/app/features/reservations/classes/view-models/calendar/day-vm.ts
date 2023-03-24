import { DestinationVM } from './destination-vm'

export interface DayVM {

    date: string,
    weekdayName: string,
    value: number,
    monthName: string,
    pax?: number,
    destinations?: DestinationVM[]

}

