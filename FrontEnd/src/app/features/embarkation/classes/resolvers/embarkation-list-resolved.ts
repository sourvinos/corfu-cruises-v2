import { EmbarkationReservationVM } from '../view-models/list/embarkation-reservation-vm'

export class EmbarkationListResolved {

    constructor(public list: EmbarkationReservationVM, public error: any = null) { }

}
