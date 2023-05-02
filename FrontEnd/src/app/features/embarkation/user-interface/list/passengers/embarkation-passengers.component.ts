import { Component, Inject, NgZone } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// Custom
import { EmbarkationPassengerVM } from '../../../classes/view-models/list/embarkation-passenger-vm'
import { EmbarkationService } from '../../../classes/services/embarkation.service'
import { EmbarkationReservationVM } from '../../../classes/view-models/list/embarkation-reservation-vm'
import { EmojiService } from './../../../../../shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'embarkation-passengers',
    templateUrl: './embarkation-passengers.component.html',
    styleUrls: ['../../../../../../assets/styles/dialogs.css', './embarkation-passengers.component.css']
})

export class EmbarkationPassengerListComponent {

    //#region variables

    private feature = 'embarkationList'
    public reservation: EmbarkationReservationVM
    public initialReservation: EmbarkationReservationVM

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<EmbarkationPassengerListComponent>, private embarkationService: EmbarkationService, private emojiService: EmojiService, private helperService: HelperService, private messageLabelService: MessageLabelService, private ngZone: NgZone) {
        this.reservation = data.reservation
        this.initialReservation = JSON.parse(JSON.stringify(this.reservation))
    }

    //#region public methods

    public close(): void {
        this.ngZone.run(() => {
            this.dialogRef.close(this.listMustBeRefreshed())
        })
    }

    public countMissingPassengers(): number {
        return this.reservation.totalPax - this.reservation.passengers.length
    }

    public doEmbarkation(ignoreCurrentStatus: boolean, passengers: EmbarkationPassengerVM[]): void {
        const ids: number[] = []
        passengers.forEach(passenger => {
            ids.push(passenger.id)
        })
        this.embarkationService.embarkPassengers(ignoreCurrentStatus, ids).subscribe({
            complete: () => {
                passengers.forEach(passenger => {
                    const z = this.reservation.passengers.find(x => x.id == passenger.id)
                    z.isCheckedIn = ignoreCurrentStatus || !z.isCheckedIn
                })
            }
        })
    }

    public toggleEmbarkationStatus(passenger: EmbarkationPassengerVM): void {
        const passengers: EmbarkationPassengerVM[] = []
        passengers.push(passenger)
        this.doEmbarkation(false, passengers)
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string, stringToReplace = ''): string {
        return this.messageLabelService.getDescription(this.feature, id, stringToReplace)
    }

    public getNationalityIcon(nationalityCode: string): any {
        return environment.nationalitiesIconDirectory + nationalityCode.toLowerCase() + '.png'
    }

    public isEmbarkAllAllowed(): boolean {
        return this.reservation.passengers.filter(x => x.isCheckedIn == false).length == 0
    }

    public missingPassengers(): boolean {
        return this.reservation.totalPax != this.reservation.passengers.length
    }

    //#endregion

    //#region private methods

    private listMustBeRefreshed(): boolean {
        return !this.helperService.deepEqual(this.initialReservation.passengers, this.reservation.passengers)
    }

    //#endregion

}
