import { BigDecimal } from '@graphprotocol/graph-ts';

import { DepositAdded, DonateInterest, TokenAdded, TokenRemoved, Withdraw } from '../../generated/DepositRedirect/DepositRedirect';
import { DepositAsset, DepositRedirectDaily, DepositRedirectToken, Depositor } from '../../generated/schema';
import { normalize } from '../utils';

export function handleTokenAdded(event: TokenAdded): void {
    let token = DepositRedirectToken.load(event.params.tokenAddress.toHex());

    if (!token) {
        token = new DepositRedirectToken(event.params.tokenAddress.toHex());
        token.active = true;
        token.deposited = BigDecimal.zero();
        token.interest = BigDecimal.zero();
        token.save();
    }
}

export function handleTokenRemoved(event: TokenRemoved): void {
    const token = DepositRedirectToken.load(event.params.tokenAddress.toHex())!;

    token.active = false;
    token.save();
}

export function handleDepositAdded(event: DepositAdded): void {
    // validate depositor entity
    let depositor = Depositor.load(event.params.depositorAddress.toHex());

    if (!depositor) {
        depositor = new Depositor(event.params.depositorAddress.toHex());
        depositor.assets = new Array<string>();
    }

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
        depositor.save();
    }

    // validate depositRedirectDaily entity
    const depositRedirectDailyId = `${event.block.timestamp.toI32() / 86400}`;
    let depositRedirectDaily = DepositRedirectDaily.load(depositRedirectDailyId);

    if (!depositRedirectDaily) {
        depositRedirectDaily = new DepositRedirectDaily(depositRedirectDailyId);
        depositRedirectDaily.assets = new Array<string>();
    }

    // validate depositRedirectDaily asset entity
    const depositRedirectDailyAssetId = `depositRedirectDaily-${event.params.token.toHex()}-${event.block.timestamp.toI32() / 86400}`;
    let depositRedirectDailyAsset = DepositAsset.load(depositRedirectDailyAssetId);

    if (!depositRedirectDailyAsset) {
        depositRedirectDailyAsset = new DepositAsset(depositRedirectDailyAssetId);
        depositRedirectDailyAsset.asset = event.params.token;
        depositRedirectDailyAsset.deposited = BigDecimal.zero();
        depositRedirectDailyAsset.interest = BigDecimal.zero();

        const depositRedirectDailyAssets = depositRedirectDaily.assets;

        depositRedirectDailyAssets.push(depositRedirectDailyAssetId);
        depositRedirectDaily.assets = depositRedirectDailyAssets;
        depositRedirectDaily.save();
    }

    // validate depositRedirectToken entity
    const depositRedirectToken = DepositRedirectToken.load(event.params.token.toHex())!;

    depositorAsset.deposited = depositorAsset.deposited.plus(normalize(event.params.amount.toString()));
    depositRedirectDailyAsset.deposited = depositRedirectDailyAsset.deposited.plus(normalize(event.params.amount.toString()));
    depositRedirectToken.deposited = depositRedirectToken.deposited.plus(normalize(event.params.amount.toString()));
    
    depositorAsset.save();
    depositRedirectDailyAsset.save();
    depositRedirectToken.save();
}

export function handleWithdraw(event: Withdraw): void {
    // validate depositor asset entity
    const depositorDepositAssetId = `depositor-${event.params.token.toHex()}-${event.params.depositorAddress.toHex()}`;
    const depositorAsset = DepositAsset.load(depositorDepositAssetId)!;

    // validate depositRedirectDaily asset entity
    const depositRedirectDailyAssetId = `depositRedirectDaily-${event.params.token.toHex()}-${event.block.timestamp.toI32() / 86400}`;
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
        }

        const depositRedirectDailyAssets = depositRedirectDaily.assets;

        depositRedirectDailyAssets.push(depositRedirectDailyAssetId);
        depositRedirectDaily.assets = depositRedirectDailyAssets;
        depositRedirectDaily.save();
    }

    // validate depositRedirectToken asset entity
    const depositRedirectToken = DepositRedirectToken.load(event.params.token.toHex())!;

    depositorAsset.deposited = depositorAsset.deposited.minus(normalize(event.params.amount.toString()));
    depositRedirectDailyAsset.deposited = depositRedirectDailyAsset.deposited.minus(normalize(event.params.amount.toString()));
    depositRedirectToken.deposited = depositRedirectToken.deposited.minus(normalize(event.params.amount.toString()));

    depositorAsset.interest = depositorAsset.interest.plus(normalize(event.params.interest.toString()));
    depositRedirectDailyAsset.interest = depositRedirectDailyAsset.interest.plus(normalize(event.params.interest.toString()));
    depositRedirectToken.interest = depositRedirectToken.interest.plus(normalize(event.params.interest.toString()));
    
    depositorAsset.save();
    depositRedirectDailyAsset.save();
    depositRedirectToken.save();
}

export function handleDonateInterest(event: DonateInterest): void {
    // validate depositor asset entity
    const depositorDepositAssetId = `depositor-${event.params.token.toHex()}-${event.params.depositorAddress.toHex()}`;
    const depositorAsset = DepositAsset.load(depositorDepositAssetId)!;

    // validate depositRedirectDaily asset entity
    const depositRedirectDailyAssetId = `depositRedirectDaily-${event.params.token.toHex()}-${event.block.timestamp.toI32() / 86400}`;
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
        }

        const depositRedirectDailyAssets = depositRedirectDaily.assets;

        depositRedirectDailyAssets.push(depositRedirectDailyAssetId);
        depositRedirectDaily.assets = depositRedirectDailyAssets;
        depositRedirectDaily.save();
    }

    // validate depositRedirectToken asset entity
    const depositRedirectToken = DepositRedirectToken.load(event.params.token.toHex())!;

    depositorAsset.interest = depositorAsset.interest.plus(normalize(event.params.interest.toString()));
    depositRedirectDailyAsset.interest = depositRedirectDailyAsset.interest.plus(normalize(event.params.interest.toString()));
    depositRedirectToken.interest = depositRedirectToken.interest.plus(normalize(event.params.interest.toString()));
    
    depositorAsset.save();
    depositRedirectDailyAsset.save();
    depositRedirectToken.save();
}