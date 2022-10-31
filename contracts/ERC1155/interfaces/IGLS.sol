// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IGLS is IERC1155 {
    function mintCharacter(address to, uint256 id) external;

    function burnCharacter(address from, uint256 id) external;

    function mintBerries(
        address to,
        uint id,
        uint amount,
        bytes memory data
    ) external;

    function balanceOf(address account, uint256 id)
        external
        view
        returns (uint);
}
