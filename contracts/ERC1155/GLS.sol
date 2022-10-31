// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract GLS is ERC1155, AccessControl {
    bytes32 public constant MANIPULATOR_ROLE = keccak256("MANIPULATOR_ROLE");

    string public ipfsLocation;
    uint currentTokenId;

    // Characters collection
    uint8 public constant Blackbeard = 1;
    uint8 public constant Kidd = 2;
    uint8 public constant Gorgon = 3;
    uint8 public constant King = 4;
    uint8 public constant Marco = 5;
    uint8 public constant Rayleigh = 6;
    uint8 public constant Whitebeard = 7;

    // The currency
    uint8 public constant Berries = 8;

    string name = "GrandLine Stories";
    string symbol = "GLS";

    mapping(uint => mapping(address => uint)) public _balances;

    constructor(string memory _ipfsLocation)
        ERC1155(string(abi.encodePacked(_ipfsLocation, "{id}.json")))
    {
        ipfsLocation = _ipfsLocation;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mintCharacter(address _to, uint256 id)
        external
        onlyRole(MANIPULATOR_ROLE)
    {
        _mint(_to, id, 1, "");
    }

    function burnCharacter(address from, uint256 id)
        external
        onlyRole(MANIPULATOR_ROLE)
    {
        _burn(from, id, 1);
    }

    function mintBerries(
        address to,
        uint id,
        uint amount,
        bytes memory data
    ) external onlyRole(MANIPULATOR_ROLE) {
        _mint(to, id, amount, data);
    }

    function initialize(address target) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MANIPULATOR_ROLE, target);
    }

    function uri(uint256 _id) public pure override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "https://gateway.pinata.cloud/ipfs/QmWn5BUiq9iRNreeKHQt8MeXPJATBA8Vu3nFf6M4PSJxov/",
                    Strings.toString(_id),
                    ".json"
                )
            );
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function asSingletonArray(uint el)
        public
        pure
        returns (uint[] memory result)
    {
        result = new uint[](1);
        result[0] = el;
    }
}
