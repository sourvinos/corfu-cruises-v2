import { Component, VERSION } from '@angular/core'
import { Title } from '@angular/platform-browser'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { HelperService } from '../../shared/services/helper.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent {

    //#region variables

    public companyLogo: any
    public ngVersion: any

    //#endregion

    constructor(private dateHelperService: DateHelperService, private helperService: HelperService, private sessionStorageService: SessionStorageService, private titleService: Title) { }

    //#region lifecyle hooks

    ngOnInit(): void {
        this.getAppName()
        this.setWindowTitle()
        this.getNgVersion()
        this.setCurrentYear()
        this.setCurrentPeriod()
    }

    //#endregion

    //#region private methods

    private getAppName(): void {
        this.companyLogo = this.helperService.getApplicationTitle().split(' ')
    }

    private getNgVersion(): any {
        this.ngVersion = VERSION.full
    }

    private setCurrentPeriod(): void {
        this.sessionStorageService.saveItem('fromDate', this.dateHelperService.getCurrentPeriodFromDate())
        this.sessionStorageService.saveItem('toDate', this.dateHelperService.getCurrentPeriodToDate())
    }

    private setCurrentYear(): void {
        this.sessionStorageService.saveItem('year', new Date().getUTCFullYear().toString())
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle())
    }

    //#endregion

}
