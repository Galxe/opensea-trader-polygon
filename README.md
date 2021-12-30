# Opensea Trader On Polygon
Query opensea seller, buyer and trade transactions;

### Subgraph endpoint: https://thegraph.com/hosted-service/subgraph/nftgalaxy/opensea-polygon

### Warrning: This subgraph may expire at any time

### Contracts:
OpenSea ZeroExFeeWrapper: `0xf715beb51ec8f63317d66f491e37e7bb048fcc2d`
OpenSea Exchange: `0xfede379e48C873C75F3cc0C81F7C784aD730a8F7`

### Events:
* Fill: https://0x.org/docs/guides/v3-specification#fill

### Background:
The correct way to do this is to listen to the `setExchange` function of the [ZeroExFeeWrapper contract](https://polygonscan.com/address/0xf715beb51ec8f63317d66f491e37e7bb048fcc2d), 
and then create an Exchange object based on the exchange contract address.

But since polygon doesn't support trace log, I can only do that by listening to the Fill event of the [current exchange contract](https://polygonscan.com/address/0xfede379e48C873C75F3cc0C81F7C784aD730a8F7); 

I guess the exchange contract should have forked [0xProject's ExchangeV3](https://etherscan.io/address/0x61935cbdd02287b511119ddb11aeb42f1593b7ef#code), so I used its abi.