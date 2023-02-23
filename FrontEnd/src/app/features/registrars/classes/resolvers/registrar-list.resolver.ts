import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { RegistrarService } from '../services/registrar.service'

@Injectable({ providedIn: 'root' })

export class RegistrarListResolver {

    constructor(private registrarService: RegistrarService) { }

    resolve(): Observable<ListResolved> {
        return this.registrarService.getAll().pipe(
            map((registrarList) => new ListResolved(registrarList)),
            catchError((err: any) => of(new ListResolved(null, err)))
        )
    }

}
