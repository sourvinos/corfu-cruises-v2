import { Component, VERSION } from '@angular/core'
// Custom
import { DotNetVersion } from '../../classes/dotnet-version'

@Component({
    selector: 'main-footer',
    templateUrl: './main-footer.component.html',
    styleUrls: ['./main-footer.component.css']
})

export class MainFooterComponent {

    public getDotNetVersion(): string {
        return DotNetVersion.version
    }

    public getNgVersion(): any {
        return VERSION.full
    }

}
