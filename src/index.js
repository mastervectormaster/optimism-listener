const ethers = require("ethers");
const L1BridgeUtil = require("./utils/L1BridgeUtil");
const L2BridgeUtil = require("./utils/L2BridgeUtil");
const { L2_BRIDGE_ADDRESS } = require("./constants");

const DepositFinalizedEvent = ethers.utils.id(
  "DepositFinalized(address,address,address,address,uint256,bytes)"
);
const WithdrawalInitiatedEvent = ethers.utils.id(
  "WithdrawalInitiated(address,address,address,address,uint256,bytes)"
);
const eventInterfaces = new ethers.utils.Interface([
  "event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)",
  "event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)",
]);

const l1BridgeUtil = new L1BridgeUtil();
const l2BridgeUtil = new L2BridgeUtil();
const l2Alchemy = l2BridgeUtil.alchemy;

console.log("-----   Listener Start  -------");

l2Alchemy.ws.on(
  {
    address: L2_BRIDGE_ADDRESS,
    topics: [DepositFinalizedEvent],
  },
  async (data) => {
    console.log("DepositFinalized Event from Bridge Received", data);
    const { l1Token, l2Token, from, to, amount } = eventInterfaces.decodeEventLog(
      "DepositFinalized",
      data.data,
      data.topics
    );
    console.log("DepositFinalized Event Decode Result");
    console.log({ l1Token }, { l2Token }, { from }, { to }, { amount });
  }
);

l2Alchemy.ws.on(
  {
    address: L2_BRIDGE_ADDRESS,
    topics: [WithdrawalInitiatedEvent],
  },
  async (data) => {
    console.log("WithdrawalInitiated Event from Bridge Received", data);
    const { l1Token, l2Token, from, to, amount } = eventInterfaces.decodeEventLog(
      "WithdrawalInitiated",
      data.data,
      data.topics
    );
    console.log("WithdrawalInitiated Event Decode Result");
    console.log({ l1Token }, { l2Token }, { from }, { to }, { amount });
  }
);
