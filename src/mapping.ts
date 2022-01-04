import { BigInt } from '@graphprotocol/graph-ts'
import { Fill } from "../generated/Exchange/Exchange"
import { Buyer, Seller, Transaction } from "../generated/schema"

const OPENSEA_ZeroExFeeWrapper_ADDR = "0xf715beb51ec8f63317d66f491e37e7bb048fcc2d";
const START_TIMESTAMP = BigInt.fromI32(1641340800); // 2022-01-05 00:00:00 UTC
const END_TIMESTAMP = BigInt.fromI32(1643155200);   // 2022-01-26 00:00:00 UTC
const BIG_ZERO = BigInt.fromI32(0);
const BIG_ONE = BigInt.fromI32(1);

export function handleFill(event: Fill): void {
    if (event.transaction.to.toHexString() != OPENSEA_ZeroExFeeWrapper_ADDR) {
        return;
    }
    if (event.block.timestamp.lt(START_TIMESTAMP)
    || event.block.timestamp.gt(END_TIMESTAMP)) {
        // end
        return
    }
    
    // first is buyer
    // second is seller
    let traderAddr = event.params.makerAddress.toHexString();
    let txHash = event.transaction.hash.toHexString();

    let tx = Transaction.load(txHash);
    if (tx == null) {
        // buyer
        tx = new Transaction(txHash);
        tx.buyer = traderAddr;
        tx.timestamp = event.block.timestamp;
        saveAndUpdateBuyer(traderAddr);
    } else {
        // seller
        tx.seller = traderAddr;
        saveAndUpdateSeller(traderAddr);
    }
    tx.save();
}

function saveAndUpdateBuyer(addr: string): void {
    let buyer = Buyer.load(addr);
    if (buyer == null) {
        buyer = new Buyer(addr);
        buyer.tradeCount = BIG_ZERO;
    }
    buyer.tradeCount = buyer.tradeCount.plus(BIG_ONE);
    buyer.save();
}

function saveAndUpdateSeller(addr: string): void {
    let seller = Seller.load(addr);
    if (seller == null) {
        seller = new Seller(addr);
        seller.tradeCount = BIG_ZERO;
    }
    seller.tradeCount = seller.tradeCount.plus(BIG_ONE);
    seller.save();
}
