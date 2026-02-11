// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Staking — Lock BONSAI for a period, earn rewards (Level 5 & 6).
 *
 * Concepts taught:
 * - Level 5: Staking = locking tokens; approve + transferFrom to contract.
 * - Level 6: Claiming rewards = on-chain state change; new tx visible on Etherscan.
 * - Locked liquidity, opportunity cost, rewards vs risk.
 */
contract Staking is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;

    uint256 public constant LOCK_DURATION = 7 days;
    uint256 public constant REWARD_RATE_BPS = 500; // 5% over lock period (e.g. 500/10000)

    struct Stake {
        uint256 amount;
        uint256 lockedUntil;
        uint256 rewardClaimedAt; // snapshot for reward calc
    }
    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount, uint256 lockedUntil);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Staking: zero amount");
        Stake storage s = stakes[msg.sender];
        require(s.amount == 0, "Staking: already staked; withdraw first");

        s.amount = amount;
        s.lockedUntil = block.timestamp + LOCK_DURATION;
        s.rewardClaimedAt = block.timestamp;

        token.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount, s.lockedUntil);
    }

    function withdraw() external {
        Stake storage s = stakes[msg.sender];
        require(s.amount > 0, "Staking: no stake");
        require(block.timestamp >= s.lockedUntil, "Staking: still locked");

        uint256 amount = s.amount;
        s.amount = 0;
        s.lockedUntil = 0;
        token.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    /// @notice Claim rewards (BONSAI). Owner must fund this contract with BONSAI for rewards.
    function claimRewards() external {
        Stake storage s = stakes[msg.sender];
        require(s.amount > 0, "Staking: no stake");

        uint256 reward = _pendingReward(msg.sender);
        s.rewardClaimedAt = block.timestamp;

        if (reward > 0) {
            token.safeTransfer(msg.sender, reward);
            emit RewardsClaimed(msg.sender, reward);
        }
    }

    function _pendingReward(address user) internal view returns (uint256) {
        Stake memory s = stakes[user];
        if (s.amount == 0) return 0;
        uint256 elapsed = block.timestamp - s.rewardClaimedAt;
        return (s.amount * REWARD_RATE_BPS * elapsed) / (10000 * LOCK_DURATION);
    }

    function pendingReward(address user) external view returns (uint256) {
        return _pendingReward(user);
    }
}
