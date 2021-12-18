import { Transfer } from '../../generated/CeloDollar/CeloDollar';
import { CeloDollarEntity } from '../../generated/schema';

export function handleTransfer(event: Transfer): void {
    let transfer = CeloDollarEntity.load(event.transaction.hash.toHex());
    if (!transfer) {
        transfer = new CeloDollarEntity(event.transaction.hash.toHex());
        transfer.save();
    }
}
