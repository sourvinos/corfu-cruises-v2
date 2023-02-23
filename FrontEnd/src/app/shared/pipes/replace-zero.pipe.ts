import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'replaceZero' })

export class ReplaceZeroPipe implements PipeTransform {

    transform(value: number): number | string {
        return value == 0
            ? ''
            : value
    }

}