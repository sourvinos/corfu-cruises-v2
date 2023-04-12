import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface LedgerCriteriaVM {

    fromDate: string
    toDate: string
    destinations: SimpleEntity[]
    ships: SimpleEntity[]
    allDestinationsCheckbox: boolean
    allShipsCheckbox: boolean

}