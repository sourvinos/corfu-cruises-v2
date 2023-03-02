export class ScheduleWriteVM {

    constructor(

        public id: number,
        public destinationId: number,
        public portId: number,
        public date: string,
        public maxPax: number,
        public time: string,
        public isActive: boolean

    ) { }

}