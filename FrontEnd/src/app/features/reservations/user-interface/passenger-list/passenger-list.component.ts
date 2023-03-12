import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { Guid } from 'guid-typescript'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { PassengerFormComponent } from '../passenger-form/passenger-form.component'
import { PassengerReadDto } from '../../classes/dtos/form/passenger-read-dto'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { StoredPassengersModalComponent } from '../stored-passengers/stored-passengers-modal.component'
import { environment } from 'src/environments/environment'

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
    public tempPassengers: PassengerReadDto[] = []

    //#endregion

    constructor(private dialog: MatDialog, private emojiService: EmojiService, private helperService: HelperService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private sessionStorageService: SessionStorageService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.checkForTempPassengers()
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    //#endregion

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

    public deleteRow(record: PassengerReadDto): void {
        const index = this.passengers.indexOf(record)
        this.passengers.splice(index, 1)
        this.outputPassengerCount.emit(this.passengers.length)
        this.outputPassengers.emit(this.passengers)
    }

    public editRecord(record: any): void {
        this.showPassengerForm(record)
    }

    public getNationalityIcon(nationalityCode: string): any {
        return environment.nationalitiesIconDirectory + nationalityCode.toLowerCase() + '.png'
    }

    public highlightRow(id: any): void {
        this.helperService.highlightRow(id)
    }

    public newRow(): void {
        this.showPassengerForm()
    }

    //#endregion

    //#region private methods

    private checkForTempPassengers(): void {
        if (this.localStorageService.getItem('passengers') != '') {
            this.tempPassengers = JSON.parse(this.localStorageService.getItem('passengers'))
        }
    }

    public showTempPassengersDialog(): void {
        if (this.localStorageService.getItem('passengers') != '') {
            const dialogRef = this.dialog.open(StoredPassengersModalComponent, {
                height: '550px',
                width: '500px',
                data: {
                    actions: ['abort', 'ok']
                },
                panelClass: 'dialog'
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    if (result.options[0].id == 1) {
                        this.passengers.push(...JSON.parse(this.localStorageService.getItem('passengers')))
                        this.outputPassengerCount.emit(this.passengers.length)
                        this.outputPassengers.emit(this.passengers)
                    }
                    if (result.options[0].id == 2) {
                        this.passengers = JSON.parse(this.localStorageService.getItem('passengers'))
                        this.outputPassengerCount.emit(this.passengers.length)
                        this.outputPassengers.emit(this.passengers)
                    }
                    if (result.options[0].id == 3) {
                        this.localStorageService.deleteItems([{ 'passengers': 'always' }])
                    }
                }
            })
        }
    }

    private sendPassengerToForm(passenger: PassengerReadDto): void {
        const dialog = this.dialog.open(PassengerFormComponent, {
            disableClose: true,
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
        dialog.afterClosed().subscribe((newPassenger: any) => {
            if (newPassenger) {
                this.passengers.push(newPassenger)
                this.outputPassengerCount.emit(this.passengers.length)
                this.outputPassengers.emit(this.passengers)
                this.updateStorageWithPassengers()
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

    private updateStorageWithPassengers(): void {
        this.localStorageService.saveItem('passengers', JSON.stringify(this.passengers))
    }

    //#endregion

}
