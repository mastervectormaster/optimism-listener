const { Network, Alchemy } = require("alchemy-sdk");
const { ALCHEMY_API_KEY, L1_BRIDGE_ADDRESS } = require("../constants");

// Util Class for getting ETH/ERC20 Balance of L1 Bridge Contract
class L1BridgeUtil {
  constructor() {
    this.alchemy = new Alchemy({
      apiKey: ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    });
  }

  async getETHBalance() {
    return this.alchemy.core.getBalance(L1_BRIDGE_ADDRESS);
  }

  async getERC20Balance(tokenAddress) {
    const balances = await alchemy.core.getTokenBalances(L1_BRIDGE_ADDRESS, [tokenAddress]);
    return balances.tokenBalances[0].tokenBalance;
  }
}

module.exports = L1BridgeUtil;