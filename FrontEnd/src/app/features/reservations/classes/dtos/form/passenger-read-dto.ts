import { Guid } from 'guid-typescript'
// Custom
import { NationalityDropdownVM } from 'src/app/features/nationalities/classes/view-models/nationality-dropdown-vm'
import { SimpleEntity } from 'src/app/shared/classes/simple-entity'

export interface PassengerReadDto {

    id: number
    reservationId: Guid
    gender: SimpleEntity
    nationality: NationalityDropdownVM
    occupant: SimpleEntity
    lastname: string
    firstname: string
    birthdate: string
    remarks: string
    specialCare: string
    isCheckedIn: boolean

}
