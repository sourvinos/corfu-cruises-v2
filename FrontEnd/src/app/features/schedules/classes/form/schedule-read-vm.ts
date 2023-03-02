import { DestinationActiveVM } from '../../../destinations/classes/view-models/destination-active-vm'
import { PortActiveVM } from 'src/app/features/ports/classes/view-models/port-active-vm'

export class ScheduleReadDto {

    constructor(

        public id: number,
        public destination: DestinationActiveVM,
        public port: PortActiveVM,
        public date: string,
        public maxPax: number,
        public time: string,
        public isActive: boolean

    ) { }

}