import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations'

export const routeAnimation = trigger('routeAnimation', [
    transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('300ms', [
            animate('0.5s ease-in', keyframes([
                style({ opacity: 0 }),
                style({ opacity: 0.5 }),
                style({ opacity: 1 })
            ]))
        ]), { optional: true })
    ])
])