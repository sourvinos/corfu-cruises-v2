import { Guid } from 'guid-typescript'
// Custom
import { CheckInPassengerWriteDto } from './check-in-passenger-write-dto'

export interface CheckInReservationWriteDto {

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
    passengers: CheckInPassengerWriteDto[]
    driverId?: number
    shipId?: number

}
