import { Component, Input } from '@angular/core'
// Custom
import { MessageLabelService } from '../../services/message-label.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'home-button-and-title',
    templateUrl: './home-button-and-title.component.html',
    styleUrls: ['./home-button-and-title.component.css']
})

export class HomeButtonAndTitleComponent {

    @Input() feature: string
    @Input() parentUrl: any
    @Input() icon: string
    @Input() featureIcon: string
    @Input() header: string

    public imgIsLoaded = false

    constructor(private messageLabelService: MessageLabelService) { }

    public getIcon(): string {
        return this.icon
    }

    public getLabel(): string {
        return this.messageLabelService.getDescription(this.feature, this.header ? this.header : 'header')
    }

    public getFeatureIcon(): any {
        return environment.featuresIconDirectory + this.featureIcon + '.svg'
    }

    public imageIsLoading(): any {
        return this.imgIsLoaded ? '' : 'skeleton'
    }

    public loadImage(): void {
        this.imgIsLoaded = true
    }

}
