// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * Faucet — Gives 20 BONSAI per user (Level 1–2 onboarding).
 *
 * Concepts taught:
 * - Testnet faucets: free tokens for learning; no mainnet value.
 * - One drip per user (rate limit) to prevent drain.
 * - Backend can trigger drip after sign-in, or user clicks "Get BONSAI".
 */
contract Faucet {
    IERC20 public immutable token;
    uint256 public constant DRIP_AMOUNT = 20 * 10**18; // 20 BONSAI (18 decimals)
    uint256 public constant COOLDOWN = 24 hours;

    mapping(address => uint256) public lastDripAt;

    event Dripped(address indexed to, uint256 amount);

    constructor(address _token) {
        token = IERC20(_token);
    }

    function drip(address to) external {
        require(to != address(0), "Faucet: zero address");
        require(
            block.timestamp >= lastDripAt[to] + COOLDOWN,
            "Faucet: cooldown"
        );
        lastDripAt[to] = block.timestamp;
        require(
            token.transfer(to, DRIP_AMOUNT),
            "Faucet: transfer failed"
        );
        emit Dripped(to, DRIP_AMOUNT);
    }

    /// @notice Owner tops up the faucet with BONSAI (transfer to this contract first).
    function balance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
