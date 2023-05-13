import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { PrimeNgModule } from './primeng.module'
import { RouterModule } from '@angular/router'
import { ZXingScannerModule } from '@zxing/ngx-scanner'
// Custom
import { CriteriaPanelComponent } from '../components/criteria-panel/criteria-panel.component'
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component'
import { HomeButtonAndTitleComponent } from '../components/home-button-and-title/home-button-and-title.component'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { LanguageMenuComponent } from '../components/top-bar-wrapper/language-menu/language-menu.component'
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component'
import { LoginLogoComponent } from 'src/app/features/login/user-interface/login-logo.component'
import { MainFooterComponent } from '../components/home/main-footer.component'
import { MaterialModule } from './material.module'
import { ModalActionResultComponent } from '../components/modal-action-result/modal-action-result.component'
import { MonthSelectorComponent } from '../components/month-selector/month-selector.component'
import { PadNumberPipe } from '../pipes/pad-number.pipe'
import { PrettyPrintPipe } from '../pipes/json-pretty.pipe'
import { ReplaceZeroPipe } from '../pipes/replace-zero.pipe'
import { SafeStylePipe } from '../pipes/safe-style.pipe'
import { TableTotalFilteredRecordsComponent } from '../components/table-total-filtered-records/table-total-filtered-records.component'
import { ThemeMenuComponent } from './../components/top-bar-wrapper/theme-menu/theme-menu.component'
import { TrimStringPipe } from './../pipes/string-trim.pipe'
import { UserPermissionDirective } from '../directives/user-permission.directive'
import { YearSelectorComponent } from '../components/year-selector/year-selector.component'

@NgModule({
    declarations: [
        CriteriaPanelComponent,
        DialogAlertComponent,
        HomeButtonAndTitleComponent,
        InputTabStopDirective,
        LanguageMenuComponent,
        LoadingSpinnerComponent,
        LoginLogoComponent,
        MainFooterComponent,
        ModalActionResultComponent,
        MonthSelectorComponent,
        PadNumberPipe,
        PrettyPrintPipe,
        ReplaceZeroPipe,
        SafeStylePipe,
        TableTotalFilteredRecordsComponent,
        ThemeMenuComponent,
        TrimStringPipe,
        UserPermissionDirective,
        YearSelectorComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        PrimeNgModule,
        RouterModule,
        ZXingScannerModule
    ],
    exports: [
        CommonModule,
        CriteriaPanelComponent,
        FormsModule,
        HomeButtonAndTitleComponent,
        InputTabStopDirective,
        LanguageMenuComponent,
        LoadingSpinnerComponent,
        LoginLogoComponent,
        MainFooterComponent,
        MaterialModule,
        MonthSelectorComponent,
        PadNumberPipe,
        PrettyPrintPipe,
        PrimeNgModule,
        ReactiveFormsModule,
        ReplaceZeroPipe,
        RouterModule,
        RouterModule,
        TableTotalFilteredRecordsComponent,
        ThemeMenuComponent,
        TrimStringPipe,
        UserPermissionDirective,
        YearSelectorComponent,
        ZXingScannerModule
    ],
    entryComponents: [
        DialogAlertComponent,
        ModalActionResultComponent
    ]
})

export class SharedModule { }
