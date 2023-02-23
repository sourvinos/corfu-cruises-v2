import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface RegistrarListVM {

    id: number
    ship: SimpleEntity
    fullname: string
    isPrimary: boolean
    isActive: boolean

}
