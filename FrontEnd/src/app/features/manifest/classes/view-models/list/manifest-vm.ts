import { ManifestPassengerVM } from './manifest-passenger-vm'
import { ManifestShipVM } from './manifest-ship-vm'
import { ShipRoute } from './../../../../shipRoutes/classes/models/shipRoute'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface ManifestVM {

    date: string
    destination: SimpleEntity
    ship: ManifestShipVM
    shipRoute: ShipRoute
    passengers: ManifestPassengerVM[]

}
