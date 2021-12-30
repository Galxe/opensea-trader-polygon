// import { BigInt } from "@graphprotocol/graph-ts"
import { log } from '@graphprotocol/graph-ts'
import { MatchOrdersCall } from "../generated/ZeroExFeeWrapper/ZeroExFeeWrapper"
import { Buyer, Saler } from "../generated/schema"

export function handleMatchOrders(call: MatchOrdersCall): void {
    let buyerAddr = call.inputs.leftOrder.makerAddress.toHexString();
    let salerAddr = call.inputs.rightOrder.makerAddress.toHexString();
    let tx = call.transaction.hash;

    log.debug('====> buyer {} saler {} tx {}', [buyerAddr, salerAddr, tx.toHexString()])

    // update buyer
    let buyer = Buyer.load(buyerAddr);
    if (buyer == null) {
        buyer = new Buyer(buyerAddr);
        buyer.transactions = new Array();
    }
    buyer.transactions.push(tx);
    buyer.save();

    // update saler
    let saler = Saler.load(salerAddr);
    if (saler == null) {
        saler = new Saler(salerAddr);
        saler.transactions = new Array();
    }
    saler.transactions.push(tx);
    saler.save();
}

