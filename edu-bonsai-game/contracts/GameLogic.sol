// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20Burnable is IERC20 {
    function burnFrom(address account, uint256 amount) external;
}

/**
 * GameLogic — Level 4 (approve + transferFrom), Level 7 (burn), Level 8 (governance).
 *
 * Concepts taught:
 * - Level 4: Contracts cannot take tokens without permission; user approve() then we transferFrom().
 * - Level 7: User burns BONSAI to unlock cosmetic; Burn event on Etherscan; total supply decreases.
 * - Level 8: Vote recorded by BONSAI balance (or snapshot); governance tokens.
 */
contract GameLogic is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;

    uint256 public constant UNLOCK_FEE = 2 * 10**18;   // 2 BONSAI to unlock feature (Level 4)
    uint256 public constant BURN_FOR_COSMETIC = 1 * 10**18; // 1 BONSAI burn (Level 7)

    mapping(address => bool) public featureUnlocked;
    mapping(address => bool) public cosmeticUnlocked;
    mapping(address => uint256) public lastVoteAt;    // Level 8: last proposal id voted
    uint256 public currentProposalId;

    event FeatureUnlocked(address indexed user, uint256 amount);
    event CosmeticUnlocked(address indexed user, uint256 burned);
    event Voted(address indexed user, uint256 proposalId, uint256 balanceAtVote);

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    /// @notice Level 4: User must approve(GameLogic, UNLOCK_FEE) first; then call this.
    function unlockFeature() external {
        require(!featureUnlocked[msg.sender], "GameLogic: already unlocked");
        token.safeTransferFrom(msg.sender, address(this), UNLOCK_FEE);
        featureUnlocked[msg.sender] = true;
        emit FeatureUnlocked(msg.sender, UNLOCK_FEE);
    }

    /// @notice Level 7: User must approve(GameLogic, BURN_FOR_COSMETIC); we burn via token.burnFrom.
    function unlockCosmetic() external {
        require(!cosmeticUnlocked[msg.sender], "GameLogic: already unlocked");
        IERC20Burnable(address(token)).burnFrom(msg.sender, BURN_FOR_COSMETIC); // Level 7: irreversible burn
        cosmeticUnlocked[msg.sender] = true;
        emit CosmeticUnlocked(msg.sender, BURN_FOR_COSMETIC);
    }

    /// @notice Level 8: Simple vote; voting power = current BONSAI balance.
    function vote(uint256 proposalId) external {
        require(proposalId <= currentProposalId, "GameLogic: invalid proposal");
        require(lastVoteAt[msg.sender] != proposalId, "GameLogic: already voted");
        lastVoteAt[msg.sender] = proposalId;
        uint256 balance = token.balanceOf(msg.sender);
        emit Voted(msg.sender, proposalId, balance);
    }

    function createProposal() external onlyOwner {
        currentProposalId++;
    }

    function withdrawFees() external onlyOwner {
        uint256 bal = token.balanceOf(address(this));
        if (bal > 0) token.safeTransfer(owner(), bal);
    }
}
