import { BigDecimal } from '@graphprotocol/graph-ts';

import { DepositAdded, DonateInterest, Withdraw } from '../../generated/DepositRedirect/DepositRedirect';
import { DepositAsset, DepositRedirectDaily, Depositor } from '../../generated/schema';
import { normalize } from '../utils';

export function handleDepositAdded(event: DepositAdded): void {
    // validate depositor entity
    let depositor = Depositor.load(event.params.depositorAddress.toHex());
    const dayId = event.block.timestamp.toI32() / 86400;

    // validate depositRedirectDaily entity
    const depositRedirectDailyId = `${dayId}`;
    let depositRedirectDaily = DepositRedirectDaily.load(depositRedirectDailyId);

    if (!depositRedirectDaily) {
        depositRedirectDaily = new DepositRedirectDaily(depositRedirectDailyId);
        depositRedirectDaily.assets = new Array<string>();
        depositRedirectDaily.depositors = 0;
    }

    // validate depositRedirectDaily asset entity
    const depositRedirectDailyAssetId = `depositRedirectDaily-${event.params.token.toHex()}-${dayId}`;
    let depositRedirectDailyAsset = DepositAsset.load(depositRedirectDailyAssetId);

    if (!depositRedirectDailyAsset) {
        depositRedirectDailyAsset = new DepositAsset(depositRedirectDailyAssetId);
        depositRedirectDailyAsset.asset = event.params.token;
        depositRedirectDailyAsset.deposited = BigDecimal.zero();
        depositRedirectDailyAsset.interest = BigDecimal.zero();

        const depositRedirectDailyAssets = depositRedirectDaily.assets;

        depositRedirectDailyAssets.push(depositRedirectDailyAssetId);
        depositRedirectDaily.assets = depositRedirectDailyAssets;
    }

    // validate depositRedirect global entity
    let depositRedirect = DepositRedirectDaily.load('0');

    if (!depositRedirect) {
        depositRedirect = new DepositRedirectDaily('0');
        depositRedirect.assets = new Array<string>();
        depositRedirect.depositors = 0;
    }

    // validate depositRedirect global asset entity
    const depositRedirectAssetId = `depositRedirect-${event.params.token.toHex()}`;
    let depositRedirectAsset = DepositAsset.load(depositRedirectAssetId);

    if (!depositRedirectAsset) {
        depositRedirectAsset = new DepositAsset(depositRedirectAssetId);
        depositRedirectAsset.asset = event.params.token;
        depositRedirectAsset.deposited = BigDecimal.zero();
        depositRedirectAsset.interest = BigDecimal.zero();

        const depositRedirectAssets = depositRedirect.assets;

        depositRedirectAssets.push(depositRedirectAssetId);
        depositRedirect.assets = depositRedirectAssets;
    }

    if (!depositor) {
        depositor = new Depositor(event.params.depositorAddress.toHex());
        depositor.assets = new Array<string>();
        depositor.firstDeposit = event.block.timestamp.toI32();

        depositRedirect.depositors += 1;
        depositRedirectDaily.depositors += 1;
    } else if (depositor.lastDeposit / 86400 != dayId) {
        // if not on the same day, count as unique depositor on that day
        depositRedirectDaily.depositors += 1;
    }
    depositor.lastDeposit = event.block.timestamp.toI32();

    // validate depositor asset entity
    const depositorDepositAssetId = `depositor-${event.params.token.toHex()}-${event.params.depositorAddress.toHex()}`;
    let depositorAsset = DepositAsset.load(depositorDepositAssetId);

    if (!depositorAsset) {
        depositorAsset = new DepositAsset(depositorDepositAssetId);
        depositorAsset.asset = event.params.token;
        depositorAsset.deposited = BigDecimal.zero();
        depositorAsset.interest = BigDecimal.zero();

        const depositorAssets = depositor.assets;

        depositorAssets.push(depositorDepositAssetId);
        depositor.assets = depositorAssets;
    }

    depositorAsset.deposited = depositorAsset.deposited.plus(normalize(event.params.amount.toString()));
    depositRedirectDailyAsset.deposited = depositRedirectDailyAsset.deposited.plus(
        normalize(event.params.amount.toString())
    );
    depositRedirectAsset.deposited = depositRedirectAsset.deposited.plus(normalize(event.params.amount.toString()));

    depositorAsset.save();
    depositRedirectDailyAsset.save();
    depositRedirectAsset.save();
    depositor.save();
    depositRedirect.save();
    depositRedirectDaily.save();
}

export function handleWithdraw(event: Withdraw): void {
    // validate depositor asset entity
    const depositorDepositAssetId = `depositor-${event.params.token.toHex()}-${event.params.depositorAddress.toHex()}`;
    const depositorAsset = DepositAsset.load(depositorDepositAssetId)!;

    // validate depositRedirectDaily asset entity
    const depositRedirectDailyAssetId = `depositRedirectDaily-${event.params.token.toHex()}-${
        event.block.timestamp.toI32() / 86400
    }`;
    let depositRedirectDailyAsset = DepositAsset.load(depositRedirectDailyAssetId);

    if (!depositRedirectDailyAsset) {
        depositRedirectDailyAsset = new DepositAsset(depositRedirectDailyAssetId);
        depositRedirectDailyAsset.asset = event.params.token;
        depositRedirectDailyAsset.deposited = BigDecimal.zero();
        depositRedirectDailyAsset.interest = BigDecimal.zero();

        // validate depositRedirectDaily entity
        const depositRedirectDailyId = `${event.block.timestamp.toI32() / 86400}`;
        let depositRedirectDaily = DepositRedirectDaily.load(depositRedirectDailyId);

        if (!depositRedirectDaily) {
            depositRedirectDaily = new DepositRedirectDaily(depositRedirectDailyId);
            depositRedirectDaily.assets = new Array<string>();
            depositRedirectDaily.depositors = 0;
        }

        const depositRedirectDailyAssets = depositRedirectDaily.assets;

        depositRedirectDailyAssets.push(depositRedirectDailyAssetId);
        depositRedirectDaily.assets = depositRedirectDailyAssets;
        depositRedirectDaily.save();
    }

    // validate depositRedirect global asset entity
    const depositRedirectAssetId = `depositRedirect-${event.params.token.toHex()}`;
    const depositRedirectAsset = DepositAsset.load(depositRedirectAssetId)!;

    depositorAsset.deposited = depositorAsset.deposited.minus(normalize(event.params.amount.toString()));
    depositRedirectDailyAsset.deposited = depositRedirectDailyAsset.deposited.minus(
        normalize(event.params.amount.toString())
    );
    depositRedirectAsset.deposited = depositRedirectAsset.deposited.minus(normalize(event.params.amount.toString()));

    depositorAsset.interest = depositorAsset.interest.plus(normalize(event.params.interest.toString()));
    depositRedirectDailyAsset.interest = depositRedirectDailyAsset.interest.plus(
        normalize(event.params.interest.toString())
    );
    depositRedirectAsset.interest = depositRedirectAsset.interest.plus(normalize(event.params.interest.toString()));

    depositorAsset.save();
    depositRedirectDailyAsset.save();
    depositRedirectAsset.save();
}

export function handleDonateInterest(event: DonateInterest): void {
    // validate depositor asset entity
    const depositorDepositAssetId = `depositor-${event.params.token.toHex()}-${event.params.depositorAddress.toHex()}`;
    const depositorAsset = DepositAsset.load(depositorDepositAssetId)!;

    // validate depositRedirectDaily asset entity
    const depositRedirectDailyAssetId = `depositRedirectDaily-${event.params.token.toHex()}-${
        event.block.timestamp.toI32() / 86400
    }`;
    let depositRedirectDailyAsset = DepositAsset.load(depositRedirectDailyAssetId);

    if (!depositRedirectDailyAsset) {
        depositRedirectDailyAsset = new DepositAsset(depositRedirectDailyAssetId);
        depositRedirectDailyAsset.asset = event.params.token;
        depositRedirectDailyAsset.deposited = BigDecimal.zero();
        depositRedirectDailyAsset.interest = BigDecimal.zero();

        // validate depositRedirectDaily entity
        const depositRedirectDailyId = `${event.block.timestamp.toI32() / 86400}`;
        let depositRedirectDaily = DepositRedirectDaily.load(depositRedirectDailyId);

        if (!depositRedirectDaily) {
            depositRedirectDaily = new DepositRedirectDaily(depositRedirectDailyId);
            depositRedirectDaily.assets = new Array<string>();
            depositRedirectDaily.depositors = 0;
        }

        const depositRedirectDailyAssets = depositRedirectDaily.assets;

        depositRedirectDailyAssets.push(depositRedirectDailyAssetId);
        depositRedirectDaily.assets = depositRedirectDailyAssets;
        depositRedirectDaily.save();
    }

    // validate depositRedirect global asset entity
    const depositRedirectAssetId = `depositRedirect-${event.params.token.toHex()}`;
    const depositRedirectAsset = DepositAsset.load(depositRedirectAssetId)!;

    depositorAsset.interest = depositorAsset.interest.plus(normalize(event.params.interest.toString()));
    depositRedirectDailyAsset.interest = depositRedirectDailyAsset.interest.plus(
        normalize(event.params.interest.toString())
    );
    depositRedirectAsset.interest = depositRedirectAsset.interest.plus(normalize(event.params.interest.toString()));

    depositorAsset.save();
    depositRedirectDailyAsset.save();
    depositRedirectAsset.save();
}
