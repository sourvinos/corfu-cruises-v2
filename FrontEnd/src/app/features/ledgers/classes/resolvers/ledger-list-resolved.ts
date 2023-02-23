import { LedgerVM } from '../view-models/list/ledger-vm'

export class LedgerListResolved {

    constructor(public result: LedgerVM, public error: any = null) { }

}
