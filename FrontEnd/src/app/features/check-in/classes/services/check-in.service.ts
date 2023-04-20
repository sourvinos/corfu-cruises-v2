import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { CheckInEmailVM } from '../view-models/email/check-in-email-vm'
import { CheckInReservationVM } from '../view-models/list/check-in-reservation-vm'
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class CheckInService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/checkIn')
    }

    getByRefNo(refNo: string): Observable<CheckInReservationVM> {
        return this.http.get<any>(this.url + '/refNo/' + refNo)
    }

    getByDate(date: string, destinationId: number, lastname: string, firstname: string): Observable<CheckInReservationVM> {
        return this.http.get<any>(this.url + '/date/' + date + '/destinationId/' + destinationId + '/lastname/' + lastname + '/firstname/' + firstname)
    }

    sendEmail(email: CheckInEmailVM): Observable<any> {
        return this.http.post<any>(this.url + '/sendCheckInDetails', email)
    }

}
