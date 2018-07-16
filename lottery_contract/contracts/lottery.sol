// version of solidity that our code is written in
pragma solidity^0.4.17;

// define a new contract - will have umber of methods and variables
// similar to defining a class
contract Lottery {
    // declares all the instance variables (and their types) that will exist in the contract;
    address public manager;
    address public winner;
    address[] public players;
    
    
    // functions that will be members of this contract
    
    // constructor function with same name as contract called when contract deployed
    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether);
        
        players.push(msg.sender);
    }
    
    function random() private view returns (uint) {
        return uint(keccak256( block.difficulty, now, players));
    }
    
    function pickWinner() public restrictedToManager {
        
        uint index = random() % players.length;
        winner = players[index];
        winner.transfer(this.balance); // take all money in contract and send to player
        players = new address[](0);
    }
    
    modifier restrictedToManager() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
    
}
