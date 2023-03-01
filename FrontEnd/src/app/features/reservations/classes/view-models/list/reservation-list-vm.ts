import { ReservationListCoachRouteVM } from './reservation-list-coachRoute-vm'
import { ReservationListDestinationVM } from 'src/app/features/reservations/classes/view-models/list/reservation-list-destination-vm'
import { ReservationListDriverVM } from './reservation-list-driver-vm'
import { ReservationListPickupPointVM } from './reservation-list-pickupPoint-vm'
import { ReservationListPortVM } from './reservation-list-port-vm'
import { SimpleEntity } from './../../../../../shared/classes/simple-entity'

export interface ReservationListVM {

    reservationId: string
    date: string
    adults: number
    kids: number
    free: number
    totalPax: number
    ticketNo: string
    coachRoute: ReservationListCoachRouteVM
    customer: SimpleEntity
    destination: ReservationListDestinationVM
    driver: ReservationListDriverVM
    pickupPoint: ReservationListPickupPointVM
    port: ReservationListPortVM
    ship: SimpleEntity
    user: string

}