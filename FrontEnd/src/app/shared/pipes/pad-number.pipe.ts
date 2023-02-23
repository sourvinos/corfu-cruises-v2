import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'padNumber' })

export class PadNumberPipe implements PipeTransform {

    transform(value: number | string, length: number, character: string): string {
        return this.padLeft(value.toString(), character, length)
    }

    private padLeft(text: string, padChar: string, size: number): string {
        return (String(padChar).repeat(size) + text).slice(-size)
    }

}