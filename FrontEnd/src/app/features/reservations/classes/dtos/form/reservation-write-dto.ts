import { Guid } from 'guid-typescript'
// Custom
import { PassengerWriteDto } from './passenger-write-dto'

export interface ReservationWriteDto {

    reservationId: Guid
    customerId: number
    destinationId: number
    pickupPointId: number
    portId: number
    date: string
    refNo: string
    ticketNo: string
    email: string
    phones: string
    adults: number
    kids: number
    free: number
    remarks: string
    passengers: PassengerWriteDto[]
    driverId?: number
    shipId?: number

}
