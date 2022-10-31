//SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TMNT is ERC721 {
    uint tokenCounter = 1;

    mapping(address => bool) public _minted;

    constructor() ERC721("TMNT", "TMNT Moments") {}

    mapping(uint256 => string) private _URIs;

    function mint() public returns (uint256) {
        // require(_minted[msg.sender] == false, "You can only mint once!");

        uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, newItemId);
        tokenCounter++;
        _minted[msg.sender] = true;

        return newItemId;
    }

    function tokenURI(uint256 id) public pure override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "https://gateway.pinata.cloud/ipfs/QmZTmtRyHgeyzqzy652q37zmQrU22M1ALTojvTGUs3jjAj/",
                    Strings.toString(id),
                    ".json"
                )
            );
    }
}
