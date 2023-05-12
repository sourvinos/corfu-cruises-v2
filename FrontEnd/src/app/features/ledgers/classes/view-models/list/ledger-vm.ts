import { LedgerPortGroupVM } from './ledger-port-group-vm'
import { LedgerReservationVM } from './ledger-reservation-vm'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface LedgerVM {

    customer: SimpleEntity
    adults: number
    kids: number
    free: number
    totalPax: number
    totalEmbarked: number
    totalNoShow: number
    ports: LedgerPortGroupVM[]
    reservations: LedgerReservationVM[]

}
