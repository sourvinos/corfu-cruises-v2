import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { CheckInReservationVM } from '../view-models/list/check-in-reservation-vm'
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class CheckInService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/checkIn')
    }

    get(date: string): Observable<CheckInReservationVM> {
        return this.http.get<any>('/date/' + date)

    }

}
