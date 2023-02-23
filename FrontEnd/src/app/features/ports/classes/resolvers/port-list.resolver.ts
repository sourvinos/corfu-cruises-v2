import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { PortService } from '../services/port.service'

@Injectable({ providedIn: 'root' })

export class PortListResolver {

    constructor(private portService: PortService) { }

    resolve(): Observable<ListResolved> {
        return this.portService.getAll().pipe(
            map((portList) => new ListResolved(portList)),
            catchError((err: any) => of(new ListResolved(null, err)))
        )
    }

}
