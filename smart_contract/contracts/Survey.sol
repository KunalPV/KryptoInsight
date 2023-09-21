// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Krypton.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Survey is ReentrancyGuard {
    using SafeMath for uint256;

    uint256 private sendTokensLock; // Lock to prevent reentrancy in sendTokens function
    uint256 private payRequestLock; // Lock to prevent reentrancy in payRequest function

    // Define the Owner of the smart contract
    address public owner;
    Krypton public kryptonToken; // Instance of the Krypton token contract

    constructor(address _kryptonTokenAddress) {
        owner = msg.sender;
        kryptonToken = Krypton(_kryptonTokenAddress);
    }

    // Data structures to store user-related information
    struct createSurvey {
        address sender;
        address receiver;
        uint256 amount;
        string hashedData;
    }

    struct requestRedeemToken {
        address requestor;
        uint256 amount;
        string name;
    }

    struct sendRedeemToken {
        string action;
        uint256 amount;
        address otherPartyAddress;
        string otherPartyName;
    }

    mapping(address => createSurvey[]) surveyHistory;
    mapping(address => requestRedeemToken[]) requestRedeemTokens;
    mapping(address => sendRedeemToken[]) history;

    // Function to send Krypton tokens from sender to receiver
    function sendTokens(
        address _sender,
        address _receiver,
        uint256 _amount,
        string memory _hashedData
    ) public payable nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");

        // Ensure no reentrancy
        require(sendTokensLock == 0, "Reentrancy");
        sendTokensLock = 1;

        // Transfer tokens from sender to receiver
        kryptonToken.transferFrom(_sender, _receiver, _amount);

        // Reset the reentrancy lock
        sendTokensLock = 0;

        // Add survey history for the transaction
        addSurveyHistory(_sender, _receiver, _amount, _hashedData);
    }

    // Function to create a request to the owner for token redemption
    function createRequest(uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than 0");

        // Create a new redemption request
        requestRedeemToken memory newRequest;
        newRequest.requestor = msg.sender;
        newRequest.amount = _amount;
        requestRedeemTokens[owner].push(newRequest);
    }

    // Function to pay a request made to the owner
    function payRequest(
        address _receiver,
        uint256 _amount,
        uint256 _request
    ) public payable nonReentrant {
        require(
            _request < requestRedeemTokens[owner].length,
            "No Such Request"
        );

        // Find the request matching the _receiver
        bool foundReceiver = false;
        uint256 requestIndex;
        for (uint256 i = 0; i < requestRedeemTokens[owner].length; i++) {
            if (requestRedeemTokens[owner][i].requestor == _receiver) {
                foundReceiver = true;
                requestIndex = i;
                break; // Found a match, no need to continue searching
            }
        }
        require(foundReceiver, "Receiver not found in requests");

        // Ensure no reentrancy
        require(payRequestLock == 0, "Reentrancy");
        payRequestLock = 1;

        // Transfer tokens from owner to requestor
        kryptonToken.transferFrom(owner, _receiver, _amount);

        // Reset the reentrancy lock
        payRequestLock = 0;

        // Add transaction history for the payment
        addHistory(owner, _receiver, _amount);

        // Remove the paid request
        requestRedeemTokens[owner][requestIndex] = requestRedeemTokens[owner][
            requestRedeemTokens[owner].length - 1
        ];
        requestRedeemTokens[owner].pop();
    }

    // Function to add a transaction history entry
    function addHistory(
        address sender,
        address receiver,
        uint256 _amount
    ) private {
        sendRedeemToken memory newSend;
        newSend.action = "Send";
        newSend.amount = _amount;
        newSend.otherPartyAddress = receiver;
        history[sender].push(newSend);

        sendRedeemToken memory newReceive;
        newReceive.action = "Receive";
        newReceive.amount = _amount;
        newReceive.otherPartyAddress = sender;
        history[receiver].push(newReceive);
    }

    // Function to add a survey history entry
    function addSurveyHistory(
        address sender,
        address receiver,
        uint256 _amount,
        string memory _hashedData
    ) private {
        createSurvey memory newSend;
        newSend.sender = sender;
        newSend.receiver = receiver;
        newSend.amount = _amount;
        newSend.hashedData = _hashedData;
        surveyHistory[sender].push(newSend);
    }

    // Function to get all requestRedeemTokens sent to a user
    function getMyRequests(
        address _user
    ) public view returns (address[] memory, uint256[] memory) {
        address[] memory addrs = new address[](
            requestRedeemTokens[_user].length
        );
        uint256[] memory amnt = new uint256[](
            requestRedeemTokens[_user].length
        );

        for (uint i = 0; i < requestRedeemTokens[_user].length; i++) {
            requestRedeemToken memory myRequests = requestRedeemTokens[_user][
                i
            ];
            addrs[i] = myRequests.requestor;
            amnt[i] = myRequests.amount;
        }

        return (addrs, amnt);
    }

    // Function to get all historic transactions user has been a part of
    function getMyHistory(
        address _user
    ) public view returns (sendRedeemToken[] memory) {
        return history[_user];
    }

    // Function to get all survey history user has been a part of
    function getSurveyHistory(
        address _user
    ) public view returns (createSurvey[] memory) {
        return surveyHistory[_user];
    }
}
