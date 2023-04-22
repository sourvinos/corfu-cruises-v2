import { CheckInPassengerVM } from './check-in-passenger-vm'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface CheckInReservationVM {

    body: {

        reservationId: string
        date: string,
        refNo: string
        ticketNo: string
        customer: SimpleEntity
        destination: SimpleEntity
        pickupPoint: SimpleEntity
        driver: SimpleEntity
        port: SimpleEntity
        ship: SimpleEntity
        totalPax: number
        embarkedPassengers: number
        remarks: string
        passengerIds: number[]

        passengers: CheckInPassengerVM[]

    }

}
