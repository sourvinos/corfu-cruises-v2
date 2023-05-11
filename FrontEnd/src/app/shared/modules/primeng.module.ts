import { NgModule } from '@angular/core'
// Custom
import { AccordionModule } from 'primeng/accordion'
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { MultiSelectModule } from 'primeng/multiselect'
import { TableModule } from 'primeng/table'

@NgModule({
    exports: [
        AccordionModule,
        ButtonModule,
        DropdownModule,
        MultiSelectModule,
        TableModule
    ]
})

export class PrimeNgModule { }
