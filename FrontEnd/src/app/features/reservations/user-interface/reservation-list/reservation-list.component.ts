import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Table } from 'primeng/table'
import { firstValueFrom, Subject } from 'rxjs'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { CoachRouteDistinctVM } from 'src/app/features/coachRoutes/classes/view-models/coachRoute-distinct-vm'
import { CustomerDistinctVM } from 'src/app/features/customers/classes/view-models/customer-distinct-vm'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DestinationDistinctVM } from 'src/app/features/destinations/classes/view-models/destination-distinct-vm'
import { DriverDistinctVM } from 'src/app/features/drivers/classes/view-models/driver-distinct-vm'
import { DriverReportService } from '../../classes/driver-report/services/driver-report.service'
import { DriverService } from 'src/app/features/drivers/classes/services/driver.service'
import { EmojiService } from './../../../../shared/services/emoji.service'
import { HelperService } from './../../../../shared/services/helper.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { OverbookedDestinationVM } from '../../classes/view-models/list/overbooked-destination-vm'
import { PickupPointDistinctVM } from 'src/app/features/pickupPoints/classes/view-models/pickupPoint-distinct-vm'
import { PortDistinctVM } from 'src/app/features/ports/classes/view-models/port-distinct-vm'
import { ReservationListVM } from '../../classes/view-models/list/reservation-list-vm'
import { ReservationService } from './../../classes/services/reservation.service'
import { ReservationToDriverComponent } from '../reservation-to-driver/reservation-to-driver-form.component'
import { ReservationToShipComponent } from '../reservation-to-ship/reservation-to-ship-form.component'
import { ShipService } from 'src/app/features/ships/classes/services/ship.service'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'reservation-list',
    templateUrl: './reservation-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './reservation-list.component.css']
})

export class ReservationListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    private unsubscribe = new Subject<void>()
    private url = ''
    public feature = 'reservationList'
    public featureIcon = 'reservations'
    public icon = 'arrow_back'
    public parentUrl = '/reservations'
    public records: ReservationListVM[] = []
    public selectedRecords: ReservationListVM[] = []

    public totals = [0, 0, 0]
    public isAdmin: boolean
    public overbookedDestinations: OverbookedDestinationVM[] = []

    public distinctCoachRoutes: CoachRouteDistinctVM[] = []
    public distinctCustomers: CustomerDistinctVM[] = []
    public distinctDestinations: DestinationDistinctVM[] = []
    public distinctDrivers: DriverDistinctVM[] = []
    public distinctPickupPoints: PickupPointDistinctVM[] = []
    public distinctPorts: PortDistinctVM[] = []
    public distinctShips: SimpleEntity[] = []

    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private dateHelperService: DateHelperService, private driverReportService: DriverReportService, private driverService: DriverService, private emojiService: EmojiService, private helperService: HelperService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private reservationService: ReservationService, private router: Router, private shipService: ShipService, public dialog: MatDialog) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.url = navigation.url
                this.loadRecords()
                this.populateDropdowns()
                this.storeDate()
                this.updateTotals(this.totals, this.records)
                this.calculateOverbookings()
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.getConnectedUserRole()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public assignToDriver(): void {
        if (this.isAnyRowSelected()) {
            this.saveSelectedIds()
            const dialogRef = this.dialog.open(ReservationToDriverComponent, {
                height: '550px',
                width: '500px',
                data: {
                    drivers: this.driverService.getActive(),
                    actions: ['abort', 'ok']
                },
                panelClass: 'dialog'
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    this.reservationService.assignToDriver(result.drivers[0].id, this.selectedRecords).subscribe(() => {
                        this.modalActionResultService.open(this.messageSnackbarService.success(), 'success', ['ok']).subscribe(() => {
                            this.clearSelectedRecords()
                            this.resetTableFilters()
                            this.refreshList()
                        })
                    })
                }
            })
        }
    }

    public assignToShip(): void {
        if (this.isAnyRowSelected()) {
            this.saveSelectedIds()
            const dialogRef = this.dialog.open(ReservationToShipComponent, {
                height: '550px',
                width: '500px',
                data: {
                    ships: this.shipService.getActive(),
                    actions: ['abort', 'ok']
                },
                panelClass: 'dialog'
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    this.reservationService.assignToShip(result.ships[0].id, this.selectedRecords).subscribe(() => {
                        this.modalActionResultService.open(this.messageSnackbarService.success(), 'success', ['ok']).subscribe(() => {
                            this.clearSelectedRecords()
                            this.resetTableFilters()
                            this.refreshList()
                        })
                    })
                }
            })
        }
    }

    public calculateSelectedPersons(): void {
        this.totals[2] = this.selectedRecords.reduce((sum, array) => sum + array.totalPersons, 0)
    }

    public createPdf(): void {
        this.driverReportService.doReportTasks(this.getDistinctDriverIds(this.records))
    }

    public editRecord(id: string): void {
        this.localStorageService.saveItem('returnUrl', this.url)
        this.router.navigate([this.parentUrl, id])
    }

    public filterRecords(event?: { filteredValue: any[] }): void {
        this.helperService.clearTableCheckboxes()
        this.selectedRecords.splice(0)
        this.updateTotals(this.totals, event.filteredValue)
        this.localStorageService.saveItem(this.feature, JSON.stringify(this.table.filters))
    }

    public formatDateToLocale(date: string, showWeekday = false, showYear = false): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday, showYear)
    }

    public formatRefNo(refNo: string): string {
        return this.helperService.formatRefNo(refNo, false)
    }

    public getDateFromStorage(): string {
        return this.localStorageService.getItem('date')
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getIcon(filename: string): string {
        return environment.criteriaIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public highlightRow(id: any): void {
        // this.helperService.highlightRow(id)
    }

    public isFilterDisabled(): boolean {
        return this.records.length == 0
    }

    public newRecord(): void {
        this.localStorageService.saveItem('returnUrl', this.url)
        this.router.navigate([this.parentUrl, 'new'])
    }

    public onGoBack(): void {
        this.router.navigate([this.parentUrl])
    }

    public resetTableFilters(): void {
        this.helperService.clearTableTextFilters(this.table, ['refNo', 'ticketNo'])
    }

    public showEmoji(passengerDifference: number): string {
        if (passengerDifference > 0) {
            return this.emojiService.getEmoji('yellow-circle')
        }
        if (passengerDifference == 0) {
            return this.emojiService.getEmoji('green-circle')
        }
        if (passengerDifference < 0) {
            return this.emojiService.getEmoji('red-circle')
        }
    }

    public unHighlightAllRows(): void {
        this.helperService.unHighlightAllRows()
    }

    //#endregion

    //#region private methods

    private clearSelectedRecords(): void {
        this.selectedRecords = []
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private isAnyRowSelected(): boolean {
        if (this.selectedRecords.length == 0) {
            this.modalActionResultService.open(this.messageSnackbarService.noRecordsSelected(), 'error', ['ok'])
            return false
        }
        return true
    }

    private loadRecords(): Promise<any> {
        const promise = new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error === null) {
                this.records = listResolved.list
                resolve(this.records)
            } else {
                this.router.navigate([this.parentUrl])
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(new Error('500')), 'error', ['ok'])
            }
        })
        return promise
    }

    private getConnectedUserRole(): Promise<any> {
        const promise = new Promise((resolve) => {
            firstValueFrom(this.accountService.isConnectedUserAdmin()).then((response) => {
                this.isAdmin = response
                resolve(this.isAdmin)
            })
        })
        return promise
    }

    private getDistinctDriverIds(reservations: any): any[] {
        const driverIds = []
        const x = [... new Set(reservations.map((x: { driverId: any }) => x.driverId))]
        x.forEach(element => {
            driverIds.push(element)
        })
        return driverIds
    }

    private populateDropdowns(): void {
        this.distinctCoachRoutes = this.helperService.getDistinctRecords(this.records, 'coachRoute', 'description')
        this.distinctCustomers = this.helperService.getDistinctRecords(this.records, 'customer', 'description')
        this.distinctDestinations = this.helperService.getDistinctRecords(this.records, 'destination', 'description')
        this.distinctDrivers = this.helperService.getDistinctRecords(this.records, 'driver', 'description')
        this.distinctPickupPoints = this.helperService.getDistinctRecords(this.records, 'pickupPoint', 'description')
        this.distinctPorts = this.helperService.getDistinctRecords(this.records, 'port', 'description')
        this.distinctShips = this.helperService.getDistinctRecords(this.records, 'ship', 'descriptiοn')
    }

    private refreshList(): void {
        this.router.navigate([this.url])
    }

    private saveSelectedIds(): void {
        const ids = []
        this.selectedRecords.forEach(record => {
            ids.push(record.reservationId)
        })
    }

    private storeDate(): void {
        if (this.url.includes('byRefNo')) {
            if (this.records.length > 0) {
                this.localStorageService.saveItem('date', this.records[0].date)
            } else {
                this.localStorageService.deleteItems([
                    { 'item': 'date', 'when': 'always' }
                ])
            }
        }
    }

    private updateTotals(totals: number[], filteredValue: any[]): void {
        totals[0] = this.records.reduce((sum: number, array: { totalPersons: number }) => sum + array.totalPersons, 0)
        totals[1] = filteredValue.reduce((sum: number, array: { totalPersons: number }) => sum + array.totalPersons, 0)
        totals[2] = this.selectedRecords.reduce((sum: number, array: { totalPersons: number }) => sum + array.totalPersons, 0)
    }

    private calculateOverbookings(): void {
        this.overbookedDestinations = []
        this.distinctDestinations.forEach((destination) => {
            this.reservationService.isDestinationOverbooked(this.localStorageService.getItem('date'), destination.id).subscribe((response) => {
                this.overbookedDestinations.push({
                    description: destination.longDescription,
                    isOverbooked: response
                })
            })
        })
    }

    //#endregion

}
