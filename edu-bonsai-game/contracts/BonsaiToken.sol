// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * BONSAI — ERC-20 token for the educational blockchain game.
 * Used as: in-game currency, reputation, staking asset, governance weight.
 *
 * Concepts taught:
 * - Level 1: Wallet & ownership (balanceOf, address)
 * - Level 2/3: Transfers (transfer), gas, tx confirmation
 * - Level 4: Approve + transferFrom (contracts need allowance)
 * - Level 5/6: Staking contract holds tokens; rewards
 * - Level 7: Burn reduces total supply (irreversible)
 * - Level 8: Governance (voting power = balance or snapshot)
 */
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BonsaiToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18; // 1M BONSAI, 18 decimals

    constructor() ERC20("Bonsai", "BONSAI") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /// @notice Optional: mint more for rewards (e.g. staking). Restrict to owner or staking contract.
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
