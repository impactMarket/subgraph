import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

const communityAddress: string[] = [
    '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
    '0x6a15bd0445e00b1705e0f02ad2e60902c1cbcc3e'
];
const managerAddress: string[] = [
    '0x270ec2751810dae7a1e7377dc77f9098ac9b5bce',
    '0x0c60e23d0077cc284e47fad05f133d7c50bc030d',
    '0xa0c84e218d5fd3cf903868ceb2f043cc04480bd4'
];
const beneficiaryAddress: string[] = [
    '0xeeb298432a9d38d2d4818e934e9eb325fd455dba',
    '0xd4f7a973b08f64b8f8b558ac8016fc2e0b77ad08'
];
const userAddress: string[] = [
    '0xba889d87b9aac1ac322e9ffc01040bdd16681e42',
    '0x505d61759efff407939606b47ca721e2a18f3ea2'
];

const fiveCents = BigInt.fromString('5').times(BigInt.fromI32(10).pow(16));
const toToken = (amount: string): BigInt =>
    BigInt.fromString(amount).times(BigInt.fromI32(10).pow(18));
const normalize = (amount: string): BigDecimal =>
    BigDecimal.fromString(amount).div(
        BigDecimal.fromString('1000000000000000000')
    );

const communityProps0 = new Map<string, string>();

communityProps0.set('claimAmount', toToken('5').toString());
communityProps0.set('maxClaim', '0');
communityProps0.set(
    'decreaseStep',
    BigInt.fromString('1').times(BigInt.fromI32(10).pow(16)).toString()
);
communityProps0.set('baseInterval', '0');
communityProps0.set('incrementInterval', '0');
communityProps0.set('minTranche', '0');
communityProps0.set('maxTranche', '0');
const communityProps = [communityProps0];

export {
    communityAddress,
    managerAddress,
    beneficiaryAddress,
    userAddress,
    communityProps,
    fiveCents,
    toToken,
    normalize
};
