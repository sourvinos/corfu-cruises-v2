import { Guid } from 'guid-typescript'
// Custom
import { GenderActiveVM } from 'src/app/features/genders/classes/view-models/gender-active-vm'
import { NationalityDropdownVM } from 'src/app/features/nationalities/classes/view-models/nationality-dropdown-vm'

export interface PassengerReadDto {

    id: number
    reservationId: Guid
    gender: GenderActiveVM
    nationality: NationalityDropdownVM
    occupantId: number
    lastname: string
    firstname: string
    birthdate: string
    remarks: string
    specialCare: string
    isCheckedIn: boolean

}