import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom, Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { ScheduleDeleteVM } from './../form/schedule-delete-vm'
import { ScheduleWriteVM } from '../form/schedule-write-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ScheduleService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/schedules')
    }

    //#region public methods

    public getAll(): Observable<any> {
        return this.http.get<any>(this.url)
    }

    public async getForCalendar(fromDate: string, toDate: string): Promise<any> {
        return await firstValueFrom(this.http.get<any>(this.url + '/fromDate/' + fromDate + '/toDate/' + toDate))
    }

    public addRange(scheduleObjects: ScheduleWriteVM[]): Observable<any[]> {
        return this.http.post<any[]>(this.url, scheduleObjects)
    }

    public deleteRange(scheduleObjects: ScheduleDeleteVM[]): Observable<any> {
        return this.http.post<any>(this.url + '/range/', scheduleObjects)
    }

    //#endregion

}
