// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CheckIn} from "../src/CheckIn.sol";

contract CheckInTest is Test {
    CheckIn public c;

    address alice = address(0xAA11CE);

    function setUp() public {
        c = new CheckIn();
    }

    function test_revertsOnEthSend() public {
        vm.prank(alice);
        vm.deal(alice, 1 ether);
        vm.expectRevert(CheckIn.ValueNotZero.selector);
        c.checkIn{value: 1 wei}();
    }

    function test_checkIn_happy() public {
        uint256 day0 = block.timestamp / 1 days;
        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit CheckIn.CheckedIn(alice, day0, 1);
        c.checkIn();

        assertEq(c.lastCheckInDayPlusOne(alice), day0 + 1);
        assertEq(c.streak(alice), 1);
    }

    function test_cannotCheckInTwiceSameDay() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.expectRevert(CheckIn.AlreadyCheckedInToday.selector);
        c.checkIn();
        vm.stopPrank();
    }

    function test_streak_incrementsConsecutive() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.warp(block.timestamp + 1 days);
        uint256 d1 = block.timestamp / 1 days;
        vm.expectEmit(true, true, true, true);
        emit CheckIn.CheckedIn(alice, d1, 2);
        c.checkIn();
        assertEq(c.streak(alice), 2);
        vm.stopPrank();
    }

    function test_streak_resetsAfterGap() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.warp(block.timestamp + 3 days);
        uint256 d = block.timestamp / 1 days;
        vm.expectEmit(true, true, true, true);
        emit CheckIn.CheckedIn(alice, d, 1);
        c.checkIn();
        assertEq(c.streak(alice), 1);
        vm.stopPrank();
    }
}
