import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface LedgerStoredCriteriaVM {

    fromDate: string
    toDate: string
    customers: SimpleEntity[]
    destinations: SimpleEntity[]
    ships: SimpleEntity[]
    allCustomersCheckbox: boolean
    allDestinationsCheckbox: boolean
    allShipsCheckbox: boolean

}