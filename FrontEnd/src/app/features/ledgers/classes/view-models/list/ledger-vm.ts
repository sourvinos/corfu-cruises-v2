import { LedgerPortGroupVM } from './ledger-port-group-vm'
import { LedgerReservationVM } from './ledger-reservation-vm'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface LedgerVM {

    customer: SimpleEntity
    ports: LedgerPortGroupVM[]
    reservations: LedgerReservationVM[]

}
