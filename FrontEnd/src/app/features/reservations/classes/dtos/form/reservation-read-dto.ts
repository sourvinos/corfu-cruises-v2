import { Guid } from 'guid-typescript'
// Custom
import { PassengerReadDto } from './passenger-read-dto'
import { PickupPointDropdownVM } from '../../../../pickupPoints/classes/view-models/pickupPoint-dropdown-vm'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface ReservationReadDto {

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
    passengers: PassengerReadDto

}

