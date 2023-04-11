import { Component, VERSION } from '@angular/core'
import { HttpClient } from '@angular/common/http'
// Custom
import { HttpDataService } from '../../services/http-data.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'main-footer',
    templateUrl: './main-footer.component.html',
    styleUrls: ['./main-footer.component.css']
})

export class MainFooterComponent extends HttpDataService {

    public dotnetVersion: string
    public ngVersion: string

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl)
    }

    ngOnInit(): void {
        this.http.get(environment.apiUrl + '/dotNetVersion', { responseType: 'text' }).subscribe((response) => {
            this.dotnetVersion = response
        })
        this.ngVersion = VERSION.full
    }

}
