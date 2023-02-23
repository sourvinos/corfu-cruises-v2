import { SimpleEntity } from 'src/app/shared/classes/simple-entity'
import { ManifestNationalityVM } from './manifest-nationality-vm'

export interface ManifestPassengerVM {

    id: number
    lastname: string
    firstname: string
    birthdate: string
    gender: SimpleEntity,
    nationality: ManifestNationalityVM,
    occupant: SimpleEntity,
    remarks: string
    specialCare: string

}