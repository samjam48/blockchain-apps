// version of solidity that our code is written in
pragma solidity^0.4.17;

// define a new contract - will have umber of methods and variables
// similar to defining a class
contract Inbox {
    // declares all the instance variables (and their types) that will exist in the contract;
    string public message;
    
    
    // functions that will be members of this contract
    
    // constructor function with same name as contract called when contract deployed
    function Inbox(string initialMessage) public {
        message = initialMessage;
    }
    
    
    function setMessage(string newMessage) public {
        message = newMessage;
    }
}
