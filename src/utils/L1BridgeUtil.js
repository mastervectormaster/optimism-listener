const { Network, Alchemy } = require("alchemy-sdk");
const { BigNumber } = require("ethers");
const {
  ALCHEMY_API_KEY,
  L1_BRIDGE_ADDRESS,
  ZERO_ADDRESS,
} = require("../constants");

// Util Class for getting ETH/ERC20 Balance of L1 Bridge Contract
class L1BridgeUtil {
  constructor() {
    this.alchemy = new Alchemy({
      apiKey: ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    });
    this.balances = {};
  }

  /**
   * Get Balance of the L1 Bridge Contract
   *
   * @returns ETH Balance in BigNumber
   */
  async getETHBalance() {
    return this.alchemy.core.getBalance(L1_BRIDGE_ADDRESS);
  }

  /**
   * Get ERC20 Balance of the L1 Bridge Contract
   *
   * @param tokenAddress - ERC20 Token Address
   * @returns ETH Balance in BigNumber
   */
  async getERC20Balance(tokenAddress) {
    const balances = await alchemy.core.getTokenBalances(L1_BRIDGE_ADDRESS, [
      tokenAddress,
    ]);
    return balances.tokenBalances[0].tokenBalance;
  }

  /**
   * Check Balance (ETH or ERC20) of the L1 Bridge Contract to see if the exact amount changed.
   *
   * @param {string} tokenAddress - ERC20 Token Address (zero address in case of ETH on L1)
   * @param {BigNumber} amount - Amount in Event
   * @param {boolean} isDeposit - true if the direction is from L1 to L2
   * @returns true if success
   */
  async checkBalance(tokenAddress, amount, isDeposit) {
    let needCheck = true;
    if (!this.balances[tokenAddress]) {
      console.log("First Check, only update balance");
      needCheck = false;
    }
    const originalBalance = this.balances[tokenAddress] || BigNumber.from(0);
    console.log(`checking balance of token: ${tokenAddress}`);
    const currentBalance =
      tokenAddress === ZERO_ADDRESS
        ? await this.getETHBalance()
        : await this.getERC20Balance(tokenAddress);
    console.log(`original balance: ${originalBalance}`);
    console.log(`current balance: ${currentBalance}`);
    console.log(`amount: ${amount.toString()}`)
    // update balance
    this.balances[tokenAddress] = currentBalance;
    if (needCheck) {
      const expectedBalance = isDeposit
        ? originalBalance.sub(amount)
        : originalBalance.add(amount);
      if (currentBalance.eq(expectedBalance)) {
        console.log("Check Success");
        return true;
      } else {
        console.error(`Check Failed, Potential Hacking detected`);
        console.error(
          `Expected: ${expectedBalance.toString()}, got: ${currentBalance.toString()}`
        );
        return false;
      }
    } else {
      return true;
    }
  }
}

module.exports = L1BridgeUtil;
