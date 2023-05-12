import { ActivatedRoute, Router } from '@angular/router'
import { Component } from '@angular/core'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LedgerCriteriaVM } from '../../../classes/view-models/criteria/ledger-criteria-vm'
import { LedgerPDFService } from '../../../classes/services/ledger-pdf.service'
import { LedgerVM } from '../../../classes/view-models/list/ledger-vm'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { MessageDialogService } from 'src/app/shared/services/message-dialog.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'ledger-customer-list',
    templateUrl: './ledger-customer-list.component.html',
    styleUrls: ['../../../../../../assets/styles/lists.css', './ledger-customer-list.component.css', '../../../../../../assets/styles/criteria-panel.css']
})

export class LedgerCustomerListComponent {

    //#region variables

    public feature = 'ledgerList'
    public featureIcon = 'ledgers'
    public icon = 'arrow_back'
    public parentUrl = '/ledgers'
    public records: LedgerVM[] = []

    public criteriaPanels: LedgerCriteriaVM
    public activeIndex = []

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateHelperService: DateHelperService, private helperService: HelperService, private interactionService: InteractionService, private ledgerPdfService: LedgerPDFService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageDialogService, private modalActionResultService: ModalActionResultService, private router: Router, private sessionStorageService: SessionStorageService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords()
        this.subscribeToInteractionService()
        this.setTabTitle()
        this.populateCriteriaPanelsFromStorage()
    }

    //#endregion

    //#region public methods

    public exportSelected(customer: LedgerVM): void {
        this.ledgerPdfService.doReportTasks(this.records.filter(x => x.customer.id == customer.customer.id), this.criteriaPanels)
    }

    public exportAll(): void {
        this.ledgerPdfService.doReportTasks(this.records, this.criteriaPanels)
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
        this.helperService.highlightRow(id)
    }

    public toggleAccordions(state: string): void {
        this.activeIndex = Array.from(Array(state == 'open' ? this.records.length : 0).keys())
    }

    //#endregion

    //#region private methods

    private loadRecords(): Promise<any> {
        return new Promise((resolve) => {
            const listResolved = this.activatedRoute.snapshot.data[this.feature]
            if (listResolved.error === null) {
                this.records = Object.assign([], listResolved.result)
                resolve(this.records)
            } else {
                this.modalActionResultService.open(this.messageSnackbarService.filterResponse(listResolved.error), 'error', ['ok']).subscribe(() => {
                    this.goBack()
                })
            }
        })
    }

    private populateCriteriaPanelsFromStorage(): void {
        if (this.sessionStorageService.getItem('ledger-criteria')) {
            this.criteriaPanels = JSON.parse(this.sessionStorageService.getItem('ledger-criteria'))
        }
    }

    private setTabTitle(): void {
        this.helperService.setTabTitle(this.feature)
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshTabTitle.subscribe(() => {
            this.setTabTitle()
        })
    }

    //#endregion

}
