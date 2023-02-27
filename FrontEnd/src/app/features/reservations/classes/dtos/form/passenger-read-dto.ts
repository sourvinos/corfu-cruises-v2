import { Guid } from 'guid-typescript'
// Custom
import { GenderActiveVM } from 'src/app/features/genders/classes/view-models/gender-active-vm'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface PassengerReadDto {

    id: number
    reservationId: Guid
    gender: GenderActiveVM
    nationality: NationalityVM
    occupantId: number
    lastname: string
    firstname: string
    birthdate: string
    remarks: string
    specialCare: string
    isCheckedIn: boolean

}

export interface NationalityVM extends SimpleEntity { 
    
    code: string

}