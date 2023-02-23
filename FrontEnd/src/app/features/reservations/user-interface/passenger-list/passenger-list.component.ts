import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { Guid } from 'guid-typescript'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { PassengerFormComponent } from '../passenger-form/passenger-form.component'
import { PassengerReadDto } from '../../classes/dtos/form/passenger-read-dto'

@Component({
    selector: 'passenger-list',
    templateUrl: './passenger-list.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './passenger-list.component.css']
})

export class PassengerListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    @Input() passengers: PassengerReadDto[] = []
    @Input() reservationId: Guid
    @Output() outputPassengerCount = new EventEmitter()
    @Output() outputPassengers = new EventEmitter()
    private ngUnsubscribe = new Subject<void>()
    public feature = 'passengerList'

    //#endregion

    constructor(public dialog: MatDialog, private messageLabelService: MessageLabelService) { }

    //#region lifecycle hooks

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    //#endregion

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public deleteRow(record: PassengerReadDto): void {
        const index = this.passengers.indexOf(record)
        this.passengers.splice(index, 1)
        this.outputPassengerCount.emit(this.passengers.length)
        this.outputPassengers.emit(this.passengers)
    }

    public editRecord(record: any): void {
        this.showPassengerForm(record)
    }

    public newRow(): void {
        this.showPassengerForm()
    }

    //#endregion

    //#region private methods

    private sendPassengerToForm(passenger: PassengerReadDto): void {
        const dialog = this.dialog.open(PassengerFormComponent, {
            disableClose: true,
            data: {
                id: passenger.id,
                reservationId: passenger.reservationId,
                gender: { 'id': passenger.gender.id, 'description': passenger.gender.description },
                nationality: { 'id': passenger.nationality.id, 'description': passenger.nationality.description },
                lastname: passenger.lastname,
                firstname: passenger.firstname,
                birthdate: passenger.birthdate,
                remarks: passenger.remarks,
                specialCare: passenger.specialCare,
                isCheckedIn: passenger.isCheckedIn,
            }
        })
        dialog.afterClosed().subscribe((result: any) => {
            if (result) {
                passenger = this.passengers.find(({ id }) => id === result.id)
                passenger.lastname = result.lastname
                passenger.firstname = result.firstname
                passenger.nationality = result.nationality
                passenger.birthdate = result.birthdate
                passenger.gender = result.gender
                passenger.specialCare = result.specialCare
                passenger.remarks = result.remarks
                passenger.isCheckedIn = result.isCheckedIn
            }
        })

    }

    private showEmptyForm(): void {
        const dialog = this.dialog.open(PassengerFormComponent, {
            data: {
                id: 0,
                reservationId: this.reservationId,
                lastname: '',
                firstname: '',
                nationality: { 'id': 1, 'description': '' },
                gender: { 'id': 1, 'description': '' },
                birthdate: '',
                specialCare: '',
                remarks: '',
                isCheckedIn: false
            }
        })
        dialog.afterClosed().subscribe((result: any) => {
            if (result) {
                this.passengers.push(result)
                this.passengers = [...this.passengers]
                this.outputPassengerCount.emit(this.passengers.length)
                this.outputPassengers.emit(this.passengers)
            }
        })
    }

    private showPassengerForm(passenger?: any): void {
        if (passenger == undefined) {
            this.showEmptyForm()
        }
        if (passenger != undefined) {
            this.sendPassengerToForm(passenger)
        }
    }

    //#endregion

}
