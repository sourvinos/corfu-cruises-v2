import { Guid } from 'guid-typescript'
// Custom
import { CheckInPassengerReadDto } from './check-in-passenger-read-dto'
import { PickupPointDropdownVM } from 'src/app/features/pickupPoints/classes/view-models/pickupPoint-dropdown-vm'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface CheckInReservationReadDto {

    reservationId: Guid
    customer: SimpleEntity
    destination: SimpleEntity
    driver: SimpleEntity
    pickupPoint: PickupPointDropdownVM
    port: SimpleEntity
    ship: SimpleEntity
    date: string
    refNo: string
    email: string
    phones: string
    remarks: string
    adults: number
    kids: number
    free: number
    totalPax: number
    ticketNo: string
    passengers: CheckInPassengerReadDto

}

