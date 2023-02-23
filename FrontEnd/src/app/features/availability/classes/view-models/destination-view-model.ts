import { PortViewModel } from './port-view-model'

export interface DestinationViewModel {

    id: number
    description: string
    abbreviation: string
    passengerCount: number
    availableSeats: number

    ports: PortViewModel[]

}

