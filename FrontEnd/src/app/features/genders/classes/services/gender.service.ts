import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// Custom
import { GenderActiveVM } from './../view-models/gender-active-vm'
import { HttpDataService } from 'src/app/shared/services/http-data.service'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class GenderService extends HttpDataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.apiUrl + '/genders')
    }

    //#region public methods

    public getActive(): Observable<GenderActiveVM[]> {
        return this.http.get<GenderActiveVM[]>(environment.apiUrl + '/genders/getActive')
    }

    //#endregion

}
