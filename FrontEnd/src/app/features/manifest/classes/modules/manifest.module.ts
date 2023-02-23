import { NgModule } from '@angular/core'
// Custom
import { ManifestCriteriaComponent } from '../../user-interface/criteria/manifest-criteria.component'
import { ManifestListComponent } from '../../user-interface/list/manifest-list.component'
import { ManifestRouteSelectorComponent } from '../../user-interface/list/manifest-route-selector.component'
import { ManifestRoutingModule } from './manifest.routing.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        ManifestCriteriaComponent,
        ManifestListComponent,
        ManifestRouteSelectorComponent
    ],
    imports: [
        SharedModule,
        ManifestRoutingModule
    ]
})

export class ManifestModule { }
