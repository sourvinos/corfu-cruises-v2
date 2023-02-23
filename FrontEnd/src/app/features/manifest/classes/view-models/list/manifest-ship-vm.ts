import { ManifestRegistrarVM } from './manifest-registrar-vm'
import { ManifestShipCrewVM } from './manifest-shipCrew-vm'
import { ManifestShipOwnerVM } from './manifest-shipOwner-vm'

export interface ManifestShipVM {

    description: string
    imo: string
    flag: string
    registryNo: string
    manager: string
    managerInGreece: string
    agent: string
    shipOwner: ManifestShipOwnerVM
    registrars: ManifestRegistrarVM[]
    crew: ManifestShipCrewVM[]

}