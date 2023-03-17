import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { DateAdapter } from '@angular/material/core'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { EmbarkationCriteriaVM } from '../../../classes/view-models/criteria/embarkation-criteria-vm'
import { EmbarkationGroupVM } from '../../../classes/view-models/list/embarkation-group-vm'
import { EmbarkationPDFService } from '../../../classes/services/embarkation-pdf.service'
import { EmbarkationPassengerListComponent } from '../passengers/embarkation-passengers.component'
import { EmbarkationReservationVM } from '../../../classes/view-models/list/embarkation-reservation-vm'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from '../../../../../shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'embarkation-reservations',
    templateUrl: './embarkation-reservations.component.html',
    styleUrls: ['../../../../../../assets/styles/lists.css', './embarkation-reservations.component.css', '../../../../../../assets/styles/criteria-panel.css']
})

export class EmbarkationReservationsComponent {

    //#region variables

    @ViewChild('table') table: Table

    private unsubscribe = new Subject<void>()
    public feature = 'embarkationList'
    public featureIcon = 'embarkation'
    public icon = 'arrow_back'
    public parentUrl = '/embarkation'
    public records: EmbarkationGroupVM
    private virtualElement: any

    public criteriaPanels: EmbarkationCriteriaVM

    public totals = [0, 0, 0]
    public totalsFiltered = [0, 0, 0]

    public distinctCustomers: string[]
    public distinctDestinations: string[]
    public distinctDrivers: string[]
    public distinctPickupPoints: string[]
    public distinctPorts: string[]
    public distinctShips: string[]
    public distinctEmbarkationStatuses: string[]

    private currentUrl = '/embarkation/list'
    private scannerEnabled: boolean
    private searchByTicketNo: string

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateAdapter: DateAdapter<any>, private dateHelperService: DateHelperService, private dialogService: DialogService, private embarkationPDFService: EmbarkationPDFService, private emojiService: EmojiService, private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, private sessionStorageService: SessionStorageService, public dialog: MatDialog) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd && navigation.url == this.currentUrl) {
                this.loadRecords().then(() => {
                    this.populateDropdownFilters()
                    this.filterTableFromStoredFilters()
                    this.updateTotals('totals', this.records.reservations)
                    this.updateTotals('totalsFiltered', this.records.reservations)
                    this.populateCriteriaPanelsFromStorage()
                    this.enableDisableFilters()
                    this.getLocale()
                })
            }
        })
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.subscribeToInteractionService()
        this.setTabTitle()
    }

    ngAfterViewInit(): void {
        this.doVirtualTableTasks()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public createPdf(): void {
        this.embarkationPDFService.createPDF(this.records.reservations)
    }

    public filterRecords(event: { filteredValue: any[] }): void {
        this.sessionStorageService.saveItem(this.feature + '-' + 'filters', JSON.stringify(this.table.filters))
        this.updateTotals('totalsFiltered', event.filteredValue)
        this.helperService.clearStyleFromVirtualTable()
    }

    public formatDateToLocale(date: string, showWeekday = false, showYear = false): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday, showYear)
    }

    public getEmbarkationStatusDescription(reservationStatus: SimpleEntity): string {
        switch (reservationStatus.id) {
            case 1:
                return this.getLabel('boardedFilter')
            case 2:
                return this.getLabel('pendingFilter')
            case 3:
                return this.getLabel('indeterminateFilter')
        }
    }

    public getEmbarkationStatusIcon(reservationStatus: SimpleEntity): string {
        switch (reservationStatus.id) {
            case 1:
                return this.getEmoji('green-circle')
            case 2:
                return this.getEmoji('red-circle')
            default:
                return this.getEmoji('yellow-circle')
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

    public goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    public hasRemarks(remarks: string): boolean {
        return remarks.length > 0 ? true : false
    }

    public isListFiltered(): boolean {
        const filters = this.sessionStorageService.getItem(this.feature)
        if (filters != undefined && filters != '') {
            const x = []
            for (const i in JSON.parse(filters)) {
                x.push(JSON.parse(filters)[i])
            }
            return x.filter(({ value }) => value != null).length != 0
        }
        return false
    }

    public resetTableFilters(): void {
        this.helperService.clearTableTextFilters(this.table, ['refNo', 'ticketNo', 'totalPersons'])
    }

    public showPassengers(reservation: EmbarkationReservationVM): void {
        this.storeScrollTop()
        this.storeSelectedId(reservation.refNo)
        this.hightlightSavedRow()
        this.showPassengersDialog(reservation)
    }

    public showRemarks(remarks: string): void {
        this.dialogService.open(remarks, 'info', 'center-buttons', ['ok'])
    }

    public showScannerWindow(): void {
        this.searchByTicketNo = ''
        this.scannerEnabled = true
        setTimeout(() => {
            this.positionVideo()
        }, 1000)
    }

    public unHighlightAllRows(): void {
        this.helperService.unHighlightAllRows()
    }

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private doVirtualTableTasks(): void {
        setTimeout(() => {
            this.getVirtualElement()
            this.scrollToSavedPosition()
            this.hightlightSavedRow()
        }, 1000)
    }

    private enableDisableFilters(): void {
        this.records.reservations.length == 0 ? this.helperService.disableTableFilters() : this.helperService.enableTableFilters()
    }

    private filterColumn(element: { value: any }, field: string, matchMode: string): void {
        if (element != undefined && (element.value != null || element.value != undefined)) {
            this.table.filter(element.value, field, matchMode)
        }
    }

    private filterTableFromStoredFilters(): void {
        const filters = this.sessionStorageService.getFilters(this.feature)
        if (filters != undefined) {
            setTimeout(() => {
                this.filterColumn(filters.embarkationStatusDescription, 'embarkationStatusDescription', 'in')
                this.filterColumn(filters.refNo, 'refNo', 'contains')
                this.filterColumn(filters.ticketNo, 'ticketNo', 'contains')
                this.filterColumn(filters.destinationDescription, 'destinationDescription', 'in')
                this.filterColumn(filters.customerDescription, 'customerDescription', 'in')
                this.filterColumn(filters.pickupPointDescription, 'pickupPointDescription', 'in')
                this.filterColumn(filters.driverDescription, 'driverDescription', 'in')
                this.filterColumn(filters.portDescription, 'portDescription', 'in')
                this.filterColumn(filters.shipDescription, 'shipDescription', 'in')
                this.filterColumn(filters.embarkationStatus, 'embarkationStatus', 'in')
                this.filterColumn(filters.totalPersons, 'totalPersons', 'contains')
            }, 500)
        }
    }

    private getLocale(): void {
        this.dateAdapter.setLocale(this.localStorageService.getLanguage())
    }

    private getVirtualElement(): void {
        this.virtualElement = document.getElementsByClassName('p-scroller-inline')[0]
    }

    private hightlightSavedRow(): void {
        this.helperService.highlightSavedRow(this.feature)
    }

    private loadRecords(): Promise<any> {
        const promise = new Promise((resolve) => {
            const listResolved: ListResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error === null) {
                this.records = listResolved.list
                resolve(this.records)
            } else {
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(listResolved.error), 'error', ['ok']).subscribe(() => {
                    this.goBack()
                })
            }
        })
        return promise
    }

    private populateCriteriaPanelsFromStorage(): void {
        if (this.sessionStorageService.getItem('embarkation-criteria')) {
            this.criteriaPanels = JSON.parse(this.sessionStorageService.getItem('embarkation-criteria'))
        }
    }

    private populateDropdownFilters(): void {
        this.distinctCustomers = this.helperService.getDistinctRecords(this.records.reservations, 'customer', 'description')
        this.distinctDestinations = this.helperService.getDistinctRecords(this.records.reservations, 'destination', 'description')
        this.distinctDrivers = this.helperService.getDistinctRecords(this.records.reservations, 'driver', 'description')
        this.distinctPickupPoints = this.helperService.getDistinctRecords(this.records.reservations, 'pickupPoint', 'description')
        this.distinctPorts = this.helperService.getDistinctRecords(this.records.reservations, 'port', 'description')
        this.distinctShips = this.helperService.getDistinctRecords(this.records.reservations, 'ship', 'description')
        this.distinctEmbarkationStatuses = this.helperService.getDistinctRecords(this.records.reservations, 'embarkationStatus', 'description')
    }

    private positionVideo(): void {
        document.getElementById('video').style.left = (window.outerWidth / 2) - 320 + 'px'
        document.getElementById('video').style.top = (document.getElementById('wrapper').clientHeight / 2) - 240 + 'px'
        document.getElementById('video').style.display = 'flex'
    }

    private scrollToSavedPosition(): void {
        this.helperService.scrollToSavedPosition(this.virtualElement, this.feature)
    }

    private setTabTitle(): void {
        this.helperService.setTabTitle(this.feature)
    }

    private showPassengersDialog(reservation: EmbarkationReservationVM): void {
        const response = this.dialog.open(EmbarkationPassengerListComponent, {
            data: {
                reservation: reservation
            },
            disableClose: true,
            height: '500px',
            panelClass: 'dialog',
            width: '800px',
        })
        response.afterClosed().subscribe(result => {
            if (result !== undefined && result == true) {
                this.router.navigate([this.currentUrl])
                this.doVirtualTableTasks()
            }
        })
    }

    private storeSelectedId(refNo: string): void {
        this.sessionStorageService.saveItem(this.feature + '-id', refNo)
    }

    private storeScrollTop(): void {
        this.sessionStorageService.saveItem(this.feature + '-scrollTop', this.virtualElement.scrollTop)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshTabTitle.subscribe(() => {
            this.setTabTitle()
        })
    }

    private updateTotals(totalsArray: string, reservations: EmbarkationReservationVM[]): void {
        const x = [0, 0, 0]
        reservations.forEach(reservation => {
            x[0] += reservation.totalPax
            reservation.passengers.forEach(passenger => {
                passenger.isCheckedIn ? ++x[1] : x[1]
            })
        })
        x[2] = x[0] - x[1]
        this[totalsArray] = x
    }

    //#endregion

}
