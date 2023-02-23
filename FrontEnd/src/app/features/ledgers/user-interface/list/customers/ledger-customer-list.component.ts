import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { ConnectedUser } from 'src/app/shared/classes/connected-user'
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { LedgerCriteriaVM } from '../../../classes/view-models/criteria/ledger-criteria-vm'
import { LedgerCustomerSummaryAndReservationsComponent } from '../summary-and-reservations/ledger-summary-and-reservations.component'
import { LedgerPDFService } from '../../../classes/services/ledger-pdf.service'
import { LedgerVM } from '../../../classes/view-models/list/ledger-vm'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'ledger-customer-list',
    templateUrl: './ledger-customer-list.component.html',
    styleUrls: ['../../../../../../assets/styles/lists.css', './ledger-customer-list.component.css', '../../../../../../assets/styles/criteria-panel.css']
})

export class LedgerCustomerListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    private unsubscribe = new Subject<void>()
    public feature = 'ledgerList'
    public featureIcon = 'ledgers'
    public icon = 'arrow_back'
    public parentUrl = '/ledgers'
    public isVirtual = false

    public criteriaPanels: LedgerCriteriaVM

    public records: LedgerVM[] = []
    public recordsFilteredCount: number
    public selectedRecords: LedgerVM[] = []

    public isAdmin = false

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateHelperService: DateHelperService, private helperService: HelperService, private ledgerPdfService: LedgerPDFService, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private modalActionResultService: ModalActionResultService, private router: Router, public dialog: MatDialog) {
        this.getConnectedUserRole()
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.toggleVirtualTable()
        this.loadRecords()
        this.toggleVirtualTable()
        this.populateCriteriaPanelsFromStorage()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public exportSelected(): void {
        this.helperService.sortNestedArray(this.selectedRecords, 'customer.description')
        this.ledgerPdfService.createPDF(this.selectedRecords, this.criteriaPanels)
    }

    public filterRecords(event: { filteredValue: any[] }): void {
        this.recordsFilteredCount = event.filteredValue.length
    }

    public formatDateToLocale(date: string, showWeekday = false, showYear = false): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday, showYear)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getIcon(filename: string): string {
        return environment.menuIconDirectory + filename + '.svg'
    }

    public goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    public highlightRow(id: any): void {
        // this.helperService.highlightRow(id)
    }

    public resetTableFilters(): void {
        this.helperService.clearTableTextFilters(this.table, ['customer.description'])
    }

    public showCustomerReservations(customer: LedgerVM): void {
        this.dialog.open(LedgerCustomerSummaryAndReservationsComponent, {
            height: '600px',
            width: '1010px',
            maxWidth: '1010px',
            data: {
                customer: customer,
                actions: ['abort', 'ok']
            },
            panelClass: 'dialog'
        })
    }

    //#endregion

    //#region private methods

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private getConnectedUserRole(): void {
        this.isAdmin = ConnectedUser.isAdmin
    }

    private loadRecords(): void {
        const listResolved = this.activatedRoute.snapshot.data[this.feature]
        if (listResolved.error === null) {
            this.records = Object.assign([], listResolved.result)
            this.recordsFilteredCount = this.records.length
        } else {
            this.modalActionResultService.open(this.messageSnackbarService.filterResponse(listResolved.error), 'error', ['ok']).subscribe(() => {
                this.goBack()
            })
        }
    }

    private populateCriteriaPanelsFromStorage(): void {
        if (this.localStorageService.getItem('ledger-criteria')) {
            this.criteriaPanels = JSON.parse(this.localStorageService.getItem('ledger-criteria'))
        }
    }

    private toggleVirtualTable(): void {
        this.isVirtual = !this.isVirtual
    }

    //#endregion

}
