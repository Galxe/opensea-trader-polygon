import { log } from '@graphprotocol/graph-ts'
import { Fill } from "../generated/Exchange/Exchange"
import { Buyer, Seller, Transaction } from "../generated/schema"

const OPENSEA_ZeroExFeeWrapper_ADDR = "0xf715beb51ec8f63317d66f491e37e7bb048fcc2d";

export function handleFill(event: Fill): void {
    if (event.transaction.to.toHexString() != OPENSEA_ZeroExFeeWrapper_ADDR) {
        return;
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
        saveBuyer(traderAddr);
    } else {
        // seller
        tx.seller = traderAddr;
        saveSeller(traderAddr);
    }
    tx.save();
}

function saveBuyer(addr: string): void {
    let buyer = Buyer.load(addr);
    if (buyer == null) {
        buyer = new Buyer(addr);
    }
    buyer.save();
}

function saveSeller(addr: string): void {
    let seller = Seller.load(addr);
    if (seller == null) {
        seller = new Seller(addr);
    }
    seller.save();
}

