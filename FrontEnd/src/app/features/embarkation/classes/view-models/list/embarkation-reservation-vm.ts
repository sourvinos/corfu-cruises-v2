import { EmbarkationDestinationVM } from './embarkation-destination-vm'
import { EmbarkationPassengerVM } from './embarkation-passenger-vm'
import { EmbarkationPortVM } from './embarkation-port-vm'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface EmbarkationReservationVM {

    refNo: string
    ticketNo: string
    customer: SimpleEntity
    destination: EmbarkationDestinationVM
    pickupPoint: SimpleEntity
    driver: SimpleEntity
    port: EmbarkationPortVM
    ship: SimpleEntity
    totalPax: number
    embarkedPassengers: number
    embarkationStatus: boolean
    isCheckedIn: string
    remarks: string
    passengerIds: number[]

    passengers: EmbarkationPassengerVM[]

}
