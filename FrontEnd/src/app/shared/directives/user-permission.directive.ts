import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core'
// Custom
import { ConnectedUser } from '../classes/connected-user'

@Directive({ selector: '[userPermission]' })

export class UserPermissionDirective {

    @Input() userPermission: string[] = []

    private role = ConnectedUser.isAdmin ? 'admin' : 'simple-user'

    constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) { }

    ngOnInit(): void {
        if (this.userPermission.indexOf(this.role) === -1) {
            this.viewContainerRef.clear()
        } else {
            this.viewContainerRef.createEmbeddedView(this.templateRef)
        }
    }

}
