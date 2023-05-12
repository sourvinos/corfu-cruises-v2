import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface LedgerCriteriaVM {

    fromDate: string
    toDate: string
    customers: SimpleEntity[]
    destinations: SimpleEntity[]
    ports: SimpleEntity[]
    ships: SimpleEntity[]
    allCustomersCheckbox: boolean
    allDestinationsCheckbox: boolean
    allPortsCheckbox: boolean
    allShipsCheckbox: boolean

}