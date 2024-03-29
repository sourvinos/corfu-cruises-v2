import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { ConnectedUser } from 'src/app/shared/classes/connected-user'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DriverReportService } from '../../classes/driver-report/services/driver-report.service'
import { EmojiService } from './../../../../shared/services/emoji.service'
import { HelperService } from './../../../../shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { MessageDialogService } from 'src/app/shared/services/message-dialog.service'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { ReservationHttpService } from '../../classes/services/reservation.http.service'
import { ReservationListDestinationVM } from 'src/app/features/reservations/classes/view-models/list/reservation-list-destination-vm'
import { ReservationListOverbookedDestinationVM } from '../../classes/view-models/list/reservation-list-overbooked-destination-vm'
import { ReservationListVM } from '../../classes/view-models/list/reservation-list-vm'
import { ReservationToDriverComponent } from '../reservation-to-driver/reservation-to-driver-form.component'
import { ReservationToShipComponent } from '../reservation-to-ship/reservation-to-ship-form.component'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
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

    private subscription = new Subscription()
    private virtualElement: any
    public feature = 'reservationList'
    public featureIcon = 'reservations'
    public icon = 'arrow_back'
    public parentUrl = '/reservations'
    public records: ReservationListVM[] = []

    public overbookedDestinations: ReservationListOverbookedDestinationVM[] = []
    public selectedRecords: ReservationListVM[] = []
    public totalPax = [0, 0, 0]

    public distinctCoachRoutes: SimpleEntity[] = []
    public distinctCustomers: SimpleEntity[] = []
    public distinctDestinations: ReservationListDestinationVM[] = []
    public distinctDrivers: SimpleEntity[] = []
    public distinctPickupPoints: SimpleEntity[] = []
    public distinctPorts: SimpleEntity[] = []
    public distinctShips: SimpleEntity[] = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateHelperService: DateHelperService, private driverReportService: DriverReportService, private emojiService: EmojiService, private helperService: HelperService, private interactionService: InteractionService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageDialogService, private modalActionResultService: ModalActionResultService, private reservationService: ReservationHttpService, private router: Router, private sessionStorageService: SessionStorageService, public dialog: MatDialog) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        this.populateDropdownFilters()
        this.filterTableFromStoredFilters()
        this.updateTotals(this.totalPax, this.records)
        this.calculateOverbookings()
        this.enableDisableFilters()
        this.storeCriteria()
        this.subscribeToInteractionService()
        this.setTabTitle()
        this.doVirtualTableTasks()
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

    public calculateSelectedPax(): void {
        this.totalPax[2] = this.selectedRecords.reduce((sum, array) => sum + array.totalPax, 0)
    }

    public createPdf(): void {
        this.driverReportService.doReportTasks(this.getDistinctDriverIds())
    }

    public editRecord(id: string): void {
        this.storeScrollTop()
        this.storeSelectedId(id)
        this.gotoEditForm(id)
    }

    public filterRecords(event?: { filteredValue: any[] }): void {
        this.helperService.clearTableCheckboxes()
        this.sessionStorageService.saveItem(this.feature + '-' + 'filters', JSON.stringify(this.table.filters))
        this.selectedRecords.splice(0)
        this.updateTotals(this.totalPax, event.filteredValue)
    }

    public formatDateToLocale(date: string, showWeekday = false, showYear = false): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday, showYear)
    }

    public getDateFromStorage(): string {
        const date = this.sessionStorageService.getItem('date')
        if (date != '') {
            return date
        } else {
            return this.dateHelperService.formatDateToIso(new Date())
        }
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
        this.helperService.highlightRow(id)
    }

    public isAdmin(): boolean {
        return ConnectedUser.isAdmin
    }

    public isFilterDisabled(): boolean {
        return this.records.length == 0
    }

    public newRecord(): void {
        this.router.navigate([this.parentUrl, 'new'])
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

    //#endregion

    //#region private methods

    private calculateOverbookings(): void {
        const date = this.sessionStorageService.getItem('date')
        if (date != '') {
            this.overbookedDestinations = []
            this.distinctDestinations.forEach((destination) => {
                this.reservationService.isDestinationOverbooked(this.sessionStorageService.getItem('date'), destination.id).subscribe((response) => {
                    this.overbookedDestinations.push({
                        description: destination.abbreviation,
                        isOverbooked: response
                    })
                })
            })
        }
    }

    private clearSelectedRecords(): void {
        this.selectedRecords = []
    }

    private cleanup(): void {
        this.subscription.unsubscribe()
    }

    private doVirtualTableTasks(): void {
        setTimeout(() => {
            this.getVirtualElement()
            this.scrollToSavedPosition()
            this.hightlightSavedRow()
        }, 1000)
    }

    private enableDisableFilters(): void {
        this.records.length == 0 ? this.helperService.disableTableFilters() : this.helperService.enableTableFilters()
    }

    private filterColumn(element: { value: any }, field: string, matchMode: string): void {
        if (element != undefined && (element.value != null || element.value != undefined)) {
            this.table.filter(element.value, field, matchMode)
        }
    }

    private filterTableFromStoredFilters(): void {
        const filters = this.sessionStorageService.getFilters(this.feature + '-' + 'filters')
        if (filters != undefined) {
            setTimeout(() => {
                this.filterColumn(filters.refNo, 'refNo', 'contains')
                this.filterColumn(filters.ticketNo, 'ticketNo', 'contains')
                this.filterColumn(filters.customer, 'customer', 'in')
                this.filterColumn(filters.destination, 'destination', 'in')
                this.filterColumn(filters.coachRoute, 'coachRoute', 'in')
                this.filterColumn(filters.pickupPoint, 'pickupPoint', 'in')
                this.filterColumn(filters.driver, 'driver', 'in')
                this.filterColumn(filters.port, 'port', 'in')
                this.filterColumn(filters.ship, 'ship', 'in')
            }, 500)
        }
    }

    private getDistinctDriverIds(): any[] {
        const driverIds = []
        this.distinctDrivers.forEach(driver => {
            driverIds.push(driver.id)
        })
        return driverIds
    }

    private getVirtualElement(): void {
        this.virtualElement = document.getElementsByClassName('p-scroller-inline')[0]
    }

    private gotoEditForm(id: any): void {
        this.router.navigate([this.parentUrl, id])
    }

    private hightlightSavedRow(): void {
        this.helperService.highlightSavedRow(this.feature)
    }

    private isAnyRowSelected(): boolean {
        if (this.selectedRecords.length == 0) {
            this.modalActionResultService.open(this.messageSnackbarService.noRecordsSelected(), 'error', ['ok'])
            return false
        }
        return true
    }

    private loadRecords(): Promise<any> {
        return new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error === null) {
                this.records = listResolved.list
                resolve(this.records)
            } else {
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(listResolved.error), 'error', ['ok']).subscribe(() => {
                    this.router.navigate([this.parentUrl])
                })
            }
        })
    }

    private populateDropdownFilters(): void {
        this.distinctCoachRoutes = this.helperService.getDistinctRecords(this.records, 'coachRoute', 'abbreviation')
        this.distinctCustomers = this.helperService.getDistinctRecords(this.records, 'customer', 'description')
        this.distinctDestinations = this.helperService.getDistinctRecords(this.records, 'destination', 'description')
        this.distinctDrivers = this.helperService.getDistinctRecords(this.records, 'driver', 'description')
        this.distinctPickupPoints = this.helperService.getDistinctRecords(this.records, 'pickupPoint', 'description')
        this.distinctPorts = this.helperService.getDistinctRecords(this.records, 'port', 'description')
        this.distinctShips = this.helperService.getDistinctRecords(this.records, 'ship', 'description')
    }

    private refreshList(): void {
        this.router.navigateByUrl(this.router.url)
    }

    private saveSelectedIds(): void {
        const ids = []
        this.selectedRecords.forEach(record => {
            ids.push(record.reservationId)
        })
    }

    private scrollToSavedPosition(): void {
        this.helperService.scrollToSavedPosition(this.virtualElement, this.feature)
    }

    private setTabTitle(): void {
        this.helperService.setTabTitle(this.feature)
    }

    private storeCriteria(): void {
        if (this.records.length > 0) {
            this.sessionStorageService.saveItem('date', this.records[0].date)
        }
    }

    private storeScrollTop(): void {
        this.sessionStorageService.saveItem(this.feature + '-scrollTop', this.virtualElement.scrollTop)
    }

    private storeSelectedId(id: string): void {
        this.sessionStorageService.saveItem(this.feature + '-id', id)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshTabTitle.subscribe(() => {
            this.setTabTitle()
        })
    }

    private updateTotals(totalPax: number[], filteredValue: any[]): void {
        totalPax[0] = this.records.reduce((sum: number, array: { totalPax: number }) => sum + array.totalPax, 0)
        totalPax[1] = filteredValue.reduce((sum: number, array: { totalPax: number }) => sum + array.totalPax, 0)
        totalPax[2] = this.selectedRecords.reduce((sum: number, array: { totalPax: number }) => sum + array.totalPax, 0)
    }

    //#endregion

}
