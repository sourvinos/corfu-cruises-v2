import { ManifestNationalityVM } from './manifest-nationality-vm'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface ManifestShipCrewVM {

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