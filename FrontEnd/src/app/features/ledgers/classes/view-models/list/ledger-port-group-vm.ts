import { LedgerPortVM } from './ledger-port-vm'

export interface LedgerPortGroupVM {

    port: LedgerPortVM
    hasTransferGroup: HasTransferGroupVM[]
    adults: number
    kids: number
    free: number
    totalPax: number
    totalPassengers: number
    totalNoShow: number

}

export interface HasTransferGroupVM {

    hasTransfer: boolean
    adults: number
    kids: number
    free: number
    totalPax: number
    totalPassengers: number
    totalNoShow: number

}