import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

const communityAddress: string[] = [
    '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
    '0x6a15bd0445e00b1705e0f02ad2e60902c1cbcc3e',
    '0x3b0c1a3d5a9f8d7a4abaa41ab82f819b5b71937e',
    '0x1c4b70a24eccb9b505b2a4cf3a2e5a006e25b7b2',
];
const managerAddress: string[] = [
    '0x270ec2751810dae7a1e7377dc77f9098ac9b5bce',
    '0x0c60e23d0077cc284e47fad05f133d7c50bc030d',
    '0xa0c84e218d5fd3cf903868ceb2f043cc04480bd4',
    '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819'
];
const beneficiaryAddress: string[] = [
    '0xeeb298432a9d38d2d4818e934e9eb325fd455dba',
    '0xd4f7a973b08f64b8f8b558ac8016fc2e0b77ad08',
    '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0xdd974d5c2e2928dea5f71b9825b8b646686bd200'
];
const userAddress: string[] = [
    '0xba889d87b9aac1ac322e9ffc01040bdd16681e42',
    '0x505d61759efff407939606b47ca721e2a18f3ea2',
    '0x8f8f72aa9304c8b593d555f12ef6589cc3a579a2'
];
const ambassadorAddress: string[] = [
    '0x6ad310c268901efafc1e2afed9444e46acd716d1',
    '0xc60cc9607da75542fee955dc000786f7bc12a722',
    '0x07cec7b5c997720f7351718400664beeb02b747a'
];

const CELOAddress = '0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9';
const cEURAddress = '0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f';
const cREALAddress = '0xe4d517785d091d3c54818832db6094bcc2744545';
const cUSDAddress = '0x874069fa1eb16d44d622f2e0ca25eea172369bc1';

const fiveCents = BigInt.fromString('5').times(BigInt.fromI32(10).pow(16));
const toToken = (amount: string): BigInt => BigInt.fromString(amount).times(BigInt.fromI32(10).pow(18));
const normalize = (amount: string): BigDecimal =>
    BigDecimal.fromString(amount).div(BigDecimal.fromString('1000000000000000000'));

const communityProps0 = new Map<string, string>();

communityProps0.set('originalClaimAmount', toToken('5').toString());
communityProps0.set('maxTotalClaim', toToken('500').toString());
communityProps0.set('decreaseStep', BigInt.fromString('1').times(BigInt.fromI32(10).pow(16)).toString());
communityProps0.set('baseInterval', '120960');
communityProps0.set('incrementInterval', '360');
communityProps0.set('minTranche', '0');
communityProps0.set('maxTranche', '0');

const communityProps1 = new Map<string, string>();

communityProps1.set('originalClaimAmount', toToken('1').toString());
communityProps1.set('maxTotalClaim', toToken('100').toString());
communityProps1.set('decreaseStep', BigInt.fromString('2').times(BigInt.fromI32(10).pow(16)).toString());
communityProps1.set('baseInterval', '17280');
communityProps1.set('incrementInterval', '30');
communityProps1.set('minTranche', '0');
communityProps1.set('maxTranche', '0');

const communityProps = [communityProps0, communityProps1];

export {
    ambassadorAddress,
    communityAddress,
    managerAddress,
    beneficiaryAddress,
    userAddress,
    communityProps,
    fiveCents,
    CELOAddress,
    cEURAddress,
    cREALAddress,
    cUSDAddress,
    toToken,
    normalize
};
