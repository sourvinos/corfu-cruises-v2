import { ActivatedRoute, Router } from '@angular/router'
import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { Table } from 'primeng/table'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { ManifestCriteriaVM } from '../../classes/view-models/criteria/manifest-criteria-vm'
import { ManifestPdfService } from '../../classes/services/manifest-pdf.service'
import { ManifestRouteSelectorComponent } from './manifest-route-selector.component'
import { ManifestVM } from '../../classes/view-models/list/manifest-vm'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { MessageDialogService } from '../../../../shared/services/message-dialog.service'
import { ModalActionResultService } from 'src/app/shared/services/modal-action-result.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'manifest-list',
    templateUrl: './manifest-list.component.html',
    styleUrls: ['../../../../../assets/styles/lists.css', './manifest-list.component.css', '../../../../../assets/styles/criteria-panel.css']
})

export class ManifestListComponent {

    //#region variables

    @ViewChild('table') table: Table | undefined

    private unsubscribe = new Subject<void>()
    public feature = 'manifestList'
    public featureIcon = 'manifest'
    public icon = 'arrow_back'
    public parentUrl = '/manifest'
    public isVirtual = false

    public criteriaPanels: ManifestCriteriaVM

    public records: ManifestVM
    public totals = [0, 0, 0]
    public totalsFiltered = [0, 0, 0]

    public distinctGenders: SimpleEntity[]
    public distinctNationalities: SimpleEntity[]
    public distinctOccupants: SimpleEntity[]

    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private dateHelperService: DateHelperService, private emojiService: EmojiService, private helperService: HelperService, private interactionService: InteractionService, private manifestPdfService: ManifestPdfService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageDialogService, private modalActionResultService: ModalActionResultService, private router: Router, private sessionStorageService: SessionStorageService, public dialog: MatDialog) {
        this.toggleVirtualTable()
        this.populateCriteriaPanelsFromStorage()
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.loadRecords().then(() => {
            this.addCrewToPassengers()
            this.populateDropdownFilters()
            this.enableDisableFilters()
            this.updateTotals(this.totals, this.records.passengers)
            this.updateTotals(this.totalsFiltered, this.records.passengers)
        })
        this.subscribeToInteractionService()
        this.setTabTitle()
    }

    ngAfterViewInit(): void {
        this.toggleVirtualTable()
    }

    ngOnDestroy(): void {
        this.cleanup()
    }

    //#endregion

    //#region public methods

    public filterRecords(event: { filteredValue: any[] }): void {
        this.toggleVirtualTable()
        this.updateTotals(this.totalsFiltered, event.filteredValue)
        this.storeFilters()
        this.toggleVirtualTable()
    }

    public formatDateToLocale(date: string, showWeekday = false, showYear = false): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday, showYear)
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

    public getNationalityIcon(nationalityCode: string): any {
        return environment.nationalitiesIconDirectory + nationalityCode.toLowerCase() + '.png'
    }

    public goBack(): void {
        this.router.navigate([this.parentUrl])
    }

    public isFilterDisabled(): boolean {
        return this.records.passengers.length == 0
    }

    public resetTableFilters(): void {
        this.helperService.clearTableTextFilters(this.table, ['lastname', 'firstname'])
    }

    public showRouteSelectorDialog(): void {
        const response = this.dialog.open(ManifestRouteSelectorComponent, {
            data: this.records,
            disableClose: true,
            height: '500px',
            panelClass: 'dialog',
            width: '800px',
        })
        response.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.records.shipRoute = result
                this.manifestPdfService.createReport(this.records)
            }
        })
    }

    //#endregion

    //#region private methods

    private addCrewToPassengers(): void {
        if (this.records.passengers.length > 0) {
            this.records.ship.crew.forEach(crew => {
                this.records.passengers.push(crew)
            })
        }
    }

    private cleanup(): void {
        this.unsubscribe.next()
        this.unsubscribe.unsubscribe()
    }

    private enableDisableFilters(): void {
        this.records.passengers.length == 0 ? this.helperService.disableTableFilters() : this.helperService.enableTableFilters()
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
        if (this.sessionStorageService.getItem('manifest-criteria')) {
            this.criteriaPanels = JSON.parse(this.sessionStorageService.getItem('manifest-criteria'))
        }
    }

    private populateDropdownFilters(): void {
        if (this.records.passengers.length > 0) {
            this.distinctGenders = this.helperService.getDistinctRecords(this.records.passengers, 'gender', 'description')
            this.distinctNationalities = this.helperService.getDistinctRecords(this.records.passengers, 'nationality', 'description')
            this.distinctOccupants = this.helperService.getDistinctRecords(this.records.passengers, 'occupant', 'description')
        }
    }

    private setTabTitle(): void {
        this.helperService.setTabTitle(this.feature)
    }

    private storeFilters(): void {
        this.sessionStorageService.saveItem(this.feature, JSON.stringify(this.table.filters))
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshTabTitle.subscribe(() => {
            this.setTabTitle()
        })
    }

    private toggleVirtualTable(): void {
        this.helperService.toggleVirtualTable(this.isVirtual)
    }

    private updateTotals(totals: number[], filteredVelue: any[]): void {
        totals[0] = filteredVelue.length
        totals[1] = filteredVelue.filter(x => x.occupant.description == 'PASSENGER').length
        totals[2] = filteredVelue.filter(x => x.occupant.description == 'CREW').length
    }

    //#endregion

}