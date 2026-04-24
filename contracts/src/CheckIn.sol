// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Daily check-in on Base. User pays L2 gas only; ETH transfers are rejected.
/// @dev `lastCheckInDayPlusOne` is 0 if never, else (calendar day + 1) to distinguish "never" from "day 0".
contract CheckIn {
    error ValueNotZero();
    error AlreadyCheckedInToday();

    mapping(address => uint256) public lastCheckInDayPlusOne;
    mapping(address => uint256) public streak;

    event CheckedIn(address indexed user, uint256 indexed day, uint256 streak);

    function checkIn() external payable {
        if (msg.value != 0) revert ValueNotZero();

        uint256 day = block.timestamp / 1 days;
        uint256 stored = lastCheckInDayPlusOne[msg.sender];

        if (stored != 0) {
            uint256 prevDay = stored - 1;
            if (day == prevDay) revert AlreadyCheckedInToday();
        }

        uint256 newStreak;
        if (stored == 0) {
            newStreak = 1;
        } else {
            uint256 prevDay = stored - 1;
            if (day == prevDay + 1) {
                newStreak = streak[msg.sender] + 1;
            } else {
                newStreak = 1;
            }
        }

        lastCheckInDayPlusOne[msg.sender] = day + 1;
        streak[msg.sender] = newStreak;

        emit CheckedIn(msg.sender, day, newStreak);
    }
}
