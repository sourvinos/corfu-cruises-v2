import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Custom
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { UserService } from '../services/user.service'

@Injectable({ providedIn: 'root' })

export class UserListResolver {

    constructor(private userService: UserService) { }

    resolve(): Observable<ListResolved> {
        return this.userService.getAll().pipe(
            map((userList) => new ListResolved(userList)),
            catchError((err) => of(new ListResolved(null, err)))
        )
    }

}
