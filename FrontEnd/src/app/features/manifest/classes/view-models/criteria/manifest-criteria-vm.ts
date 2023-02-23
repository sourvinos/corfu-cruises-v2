import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface ManifestCriteriaVM {

    date: string
    destinations: SimpleEntity[]
    ports: SimpleEntity[]
    ships: SimpleEntity[]
    allPortsCheckbox: boolean

}