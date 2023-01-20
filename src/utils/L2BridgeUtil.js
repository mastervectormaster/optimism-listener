const { Network, Alchemy } = require("alchemy-sdk");
const { ALCHEMY_API_KEY, L2_BRIDGE_ADDRESS } = require("../constants");

// Util Class for getting ERC20 Balance of L2 Bridge Contract
class L2BridgeUtil {
  constructor() {
    this.alchemy = new Alchemy({
      apiKey: ALCHEMY_API_KEY,
      network: Network.OPT_MAINNET,
    });
  }

  async getERC20Balance(tokenAddress) {
    const balances = await alchemy.core.getTokenBalances(L2_BRIDGE_ADDRESS, [tokenAddress]);
    return balances.tokenBalances[0].tokenBalance;
  }
}

module.exports = L2BridgeUtil;