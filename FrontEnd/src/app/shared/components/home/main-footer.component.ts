import { Component, VERSION } from '@angular/core'

@Component({
    selector: 'main-footer',
    templateUrl: './main-footer.component.html',
    styleUrls: ['./main-footer.component.css']
})

export class MainFooterComponent {

    //#region variables

    public ngVersion: any

    //#endregion

    //#region lifecyle hooks

    ngOnInit(): void {
        this.getNgVersion()
    }

    //#endregion

    //#region private methods

    private getNgVersion(): any {
        this.ngVersion = VERSION.full
    }

    //#endregion

}
