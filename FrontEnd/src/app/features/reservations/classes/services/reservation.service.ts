import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { ReservationListVM } from '../view-models/list/reservation-list-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ReservationService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/reservations')
    }

    public getForCalendar(year: number): Observable<any> {
        return this.http.get<any>(this.url + '/year/' + year)
    }

    public getByDate(date: string): Observable<ReservationListVM> {
        return this.http.get<ReservationListVM>(this.url + '/date/' + date)
    }

    public getByDateAndDriver(date: string, driverId: number): Observable<any> {
        return this.http.get<any>(this.url + '/date/' + date + '/driver/' + driverId)
    }

    public getByRefNo(refNo: string): Observable<ReservationListVM> {
        return this.http.get<ReservationListVM>(this.url + '/byRefNo/' + refNo)
    }

    public save(formData: any): Observable<any> {
        return formData.reservationId == null
            ? this.http.post<any>(this.url, formData)
            : this.http.put<any>(this.url, formData)
    }

    public assignToDriver(driverId: string, records: any[]): Observable<any> {
        let params = new HttpParams().set('driverId', driverId).set('id', records[0].reservationId)
        records.forEach((element, index) => {
            if (index > 0) {
                params = params.append('id', element.reservationId)
            }
        })
        return this.http.patch(this.url + '/assignToDriver?', null, { params: params })
    }

    public assignToShip(shipId: string, records: any[]): Observable<any> {
        let params = new HttpParams().set('shipId', shipId).set('id', records[0].reservationId)
        records.forEach((element, index) => {
            if (index > 0) {
                params = params.append('id', element.reservationId)
            }
        })
        return this.http.patch(this.url + '/assignToShip?', null, { params: params })
    }

    public isDestinationOverbooked(date: string, destinationId: number): Observable<boolean> {
        return this.http.get<boolean>(this.url + '/isOverbooked/date/' + date + '/destinationid/' + destinationId)
    }

}
