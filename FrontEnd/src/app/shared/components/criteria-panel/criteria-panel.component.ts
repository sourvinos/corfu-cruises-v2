import { Component, Input } from '@angular/core'
// Custom
import { HelperService } from '../../services/helper.service'
import { MessageLabelService } from '../../services/message-label.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'criteria-panel',
    templateUrl: './criteria-panel.component.html',
    styleUrls: ['./criteria-panel.component.css']
})

export class CriteriaPanelComponent {

    @Input() backgroundImage: string
    @Input() feature: string
    @Input() header: string
    @Input() icon: string
    @Input() records: any[]
    @Input() sortField: string

    constructor(private helperService: HelperService, private messageLabelService: MessageLabelService) { }

    ngOnInit(): void {
        this.helperService.sortArray(this.records, this.sortField)
    }

    public getIcon(filename: string): string {
        return environment.menuIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

}
