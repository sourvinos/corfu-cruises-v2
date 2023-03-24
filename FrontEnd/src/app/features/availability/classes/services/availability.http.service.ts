import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { SessionStorageService } from 'src/app/shared/services/session-storage.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class AvailabilityHttpService extends HttpDataService {

    constructor(httpClient: HttpClient, private sessionStorageService: SessionStorageService) {
        super(httpClient, environment.apiUrl + '/availability')
    }

    public getForCalendar(): Observable<any> {
        const fromDate = this.sessionStorageService.getItem('fromDate')
        const toDate = this.sessionStorageService.getItem('toDate')
        if (fromDate != '') {
            return this.http.get<any>(this.url + '/fromDate/' + fromDate + '/toDate/' + toDate)
        }
    }

}
