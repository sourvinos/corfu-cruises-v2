import { NgModule } from '@angular/core'
// Custom
import { CustomerFormComponent } from '../../user-interface/customer-form.component'
import { CustomerListComponent } from '../../user-interface/customer-list.component'
import { CustomerRoutingModule } from './customer.routing.module'
import { SharedModule } from '../../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        CustomerListComponent,
        CustomerFormComponent
    ],
    imports: [
        SharedModule,
        CustomerRoutingModule
    ]
})

export class CustomerModule { }
