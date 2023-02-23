import { Guid } from 'guid-typescript'
// Custom
import { CustomerActiveVM } from '../../../../customers/classes/view-models/customer-active-vm'
import { DestinationActiveVM } from '../../../../destinations/classes/view-models/destination-active-vm'
import { DriverActiveVM } from '../../../../drivers/classes/view-models/driver-active-vm'
import { PassengerReadDto } from './passenger-read-dto'
import { PickupPointActiveVM } from 'src/app/features/pickupPoints/classes/view-models/pickupPoint-active-vm'
import { ShipActiveVM } from 'src/app/features/ships/classes/view-models/ship-active-vm'
import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'

export interface ReservationReadDto {

    reservationId: Guid
    customer: CustomerActiveVM
    destination: DestinationActiveVM
    driver: DriverActiveVM
    pickupPoint: PickupPointActiveVM
    port: PortActiveVM
    ship: ShipActiveVM
    date: string
    refNo: string
    email: string
    phones: string
    remarks: string
    adults: number
    kids: number
    free: number
    totalPersons: number
    ticketNo: string
    passengers: PassengerReadDto

}

