import { InteractionService } from 'src/app/shared/services/interaction.service'
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { Guid } from 'guid-typescript'
import { MatDialog } from '@angular/material/dialog'
import { Table } from 'primeng/table'
// Custom
import { CheckInPassengerFormComponent } from '../passenger-form/check-in-passenger-form.component'
import { CheckInPassengerReadDto } from '../../classes/dtos/check-in-passenger-read-dto'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'check-in-passenger-list',
    templateUrl: './check-in-passenger-list.component.html',
    styleUrls: ['./check-in-passenger-list.component.css']
})

export class CheckInPassengerListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    @Input() passengers: CheckInPassengerReadDto[] = []
    @Input() initialPassengerCount: number
    @Input() reservationId: Guid
    @Output() outputPassengerCount = new EventEmitter()
    @Output() outputPassengers = new EventEmitter()
    public feature = 'passengerList'

    //#endregion

    constructor(private interactionService: InteractionService, private dialog: MatDialog, private emojiService: EmojiService, private helperService: HelperService, private messageLabelService: MessageLabelService) { }

    //#region public methods

    public getEmbarkationStatusIcon(status: boolean): string {
        return status ? this.getEmoji('green-circle') : this.getEmoji('red-circle')
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public deleteRecord(record: CheckInPassengerReadDto): void {
        const index = this.passengers.indexOf(record)
        this.passengers.splice(index, 1)
        this.outputPassengerCount.emit(this.passengers.length)
        this.outputPassengers.emit(this.passengers)
        this.interactionService.updateReservation()

    }

    public editRecord(record: any): void {
        this.showPassengerForm(record)
    }

    public getNationalityIcon(nationalityCode: string): any {
        if (nationalityCode != undefined) {
            return environment.nationalitiesIconDirectory + nationalityCode.toLowerCase() + '.png'
        }
    }

    public highlightRow(id: any): void {
        this.helperService.highlightRow(id)
    }

    public newRow(): void {
        this.showPassengerForm()
    }

    //#endregion

    //#region private methods

    private sendPassengerToForm(passenger: CheckInPassengerReadDto): void {
        const dialog = this.dialog.open(CheckInPassengerFormComponent, {
            disableClose: true,
            width: '400px',
            data: {
                id: passenger.id,
                reservationId: passenger.reservationId,
                gender: { 'id': passenger.gender.id, 'description': passenger.gender.description },
                nationality: { 'id': passenger.nationality.id, 'code': passenger.nationality.code, 'description': passenger.nationality.description },
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
                this.interactionService.updateReservation()
            }
        })

    }

    private showEmptyForm(): void {
        const dialog = this.dialog.open(CheckInPassengerFormComponent, {
            width: '400px',
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
        dialog.afterClosed().subscribe((newPassenger: any) => {
            if (newPassenger) {
                this.passengers.push(newPassenger)
                this.outputPassengerCount.emit(this.passengers.length)
                this.outputPassengers.emit(this.passengers)
                this.interactionService.updateReservation()
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
