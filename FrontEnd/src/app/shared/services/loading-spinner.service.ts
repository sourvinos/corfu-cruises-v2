import { BehaviorSubject, Observable } from 'rxjs'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class LoadingSpinnerService {

    private count = 0
    private spinner = new BehaviorSubject<string>('')

    public getSpinnerObserver(): Observable<string> {
        return this.spinner.asObservable()
    }

    public requestStarted(): void {
        if (++this.count == 1) {
            this.spinner.next('start')
        }
    }

    public requestEnded(): void {
        if (this.count == 0 || --this.count == 0) {
            this.spinner.next('stop')
        }
    }

    public resetSpiner(): void {
        this.count = 0
        this.spinner.next('stop')
    }

}
