import { Component } from '@angular/core'
// Custom
import { HelperService } from 'src/app/shared/services/helper.service'
import { LogoService } from 'src/app/features/reservations/classes/services/logo.service'

@Component({
    selector: 'logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.css']
})

export class LogoComponent {

    //#region variables

    public companyLogoText: any

    //#endregion

    constructor(private helperService: HelperService, private logoService: LogoService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.companyLogoText = this.helperService.getApplicationTitle()
    }

    //#endregion


    //#region public methods

    public getLogo(): any {
        return this.logoService.getLogo()
    }

    //#endregion

}
