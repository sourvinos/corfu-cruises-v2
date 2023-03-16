// Base
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule, Title } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ScrollingModule } from '@angular/cdk/scrolling'
// Modules
import { AppRoutingModule } from './app.routing.module'
import { LoginModule } from '../features/login/classes/modules/login.module'
import { PrimeNgModule } from '../shared/modules/primeng.module'
import { SharedModule } from 'src/app/shared/modules/shared.module'
// Components
import { AppComponent } from './app.component'
import { LogoComponent } from '../shared/components/top-bar-wrapper/logo/logo.component'
import { ReservationsMenuComponent } from '../shared/components/top-bar-wrapper/reservations-menu/reservations-menu.component'
import { SearchByRefBoxComponent } from '../shared/components/top-bar-wrapper/search-byRef-box/search-byRef-box.component'
import { TablesMenuComponent } from '../shared/components/top-bar-wrapper/tables-menu/tables-menu.component'
import { TasksMenuComponent } from '../shared/components/top-bar-wrapper/tasks-menu/tasks-menu.component'
import { TopBarComponent } from '../shared/components/top-bar-wrapper/top-bar/top-bar.component'
import { TopMenuComponent } from '../shared/components/top-bar-wrapper/top-menu/top-menu.component'
import { UserMenuComponent } from '../shared/components/top-bar-wrapper/user-menu/user-menu.component'
// Utils
import { InterceptorService } from '../shared/services/interceptor.service'

@NgModule({
    declarations: [
        AppComponent,
        LogoComponent,
        ReservationsMenuComponent,
        SearchByRefBoxComponent,
        TablesMenuComponent,
        TasksMenuComponent,
        TopBarComponent,
        TopMenuComponent,
        UserMenuComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        LoginModule,
        PrimeNgModule,
        ReactiveFormsModule,
        ScrollingModule,
        SharedModule
    ],
    providers: [
        Title,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService, multi: true
        },
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
