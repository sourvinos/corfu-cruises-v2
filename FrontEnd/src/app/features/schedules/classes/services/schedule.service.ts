import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { ScheduleWriteVM } from '../form/schedule-write-vm'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class ScheduleService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/schedules')
    }

    //#region public methods

    public addRange(scheduleObjects: ScheduleWriteVM[]): Observable<any[]> {
        return this.http.post<any[]>(this.url, scheduleObjects)
    }

    //#endregion

}
