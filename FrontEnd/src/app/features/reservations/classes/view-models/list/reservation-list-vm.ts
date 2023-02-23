import { CoachRouteDistinctVM } from 'src/app/features/coachRoutes/classes/view-models/coachRoute-distinct-vm'
import { CustomerDistinctVM } from 'src/app/features/customers/classes/view-models/customer-distinct-vm'
import { DestinationDistinctVM } from 'src/app/features/destinations/classes/view-models/destination-distinct-vm'
import { DriverDistinctVM } from 'src/app/features/drivers/classes/view-models/driver-distinct-vm'
import { PickupPointDistinctVM } from 'src/app/features/pickupPoints/classes/view-models/pickupPoint-distinct-vm'
import { PortDistinctVM } from 'src/app/features/ports/classes/view-models/port-distinct-vm'
import { ShipDistinctVM } from 'src/app/features/ships/classes/view-models/ship-distinct-vm'

export interface ReservationListVM {

    reservationId: string
    date: string
    adults: number
    kids: number
    free: number
    totalPersons: number
    ticketNo: string
    coachRoute: CoachRouteDistinctVM
    customer: CustomerDistinctVM
    destination: DestinationDistinctVM
    driver: DriverDistinctVM
    pickupPoint: PickupPointDistinctVM
    port: PortDistinctVM
    ship: ShipDistinctVM
    user: string

}