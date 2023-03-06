import { Injectable } from '@angular/core'

export interface CanComponentDeactivate {
    canDeactivate: () => boolean
}

@Injectable({ providedIn: 'root' })

export class CanDeactivateGuard {

    canDeactivate(component: CanComponentDeactivate): boolean {
        if (component != null)
            return component.canDeactivate ? component.canDeactivate() : true
    }

}
