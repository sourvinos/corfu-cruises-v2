import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface LedgerSearchCriteriaVM {

    fromDate: string
    toDate: string
    customers: SimpleEntity[]
    destinations: SimpleEntity[]
    ships: SimpleEntity[]

}