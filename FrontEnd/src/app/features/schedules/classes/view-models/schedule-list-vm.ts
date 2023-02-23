import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface ScheduleListVM {

    id: number
    date: string
    formattedDate: string
    destination: SimpleEntity
    port: SimpleEntity
    maxPax: number

}