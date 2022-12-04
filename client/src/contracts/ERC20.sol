/**
 * ERC-20 Contract For Each Restaurant's ERC-20 Token
 * This is the Solidity contract that will be deployed to the Rinkeby testnet each time a restaurant makes a request
 * to deploy their token. Each restaurant may only deploy one token. This contract is never automatically executed 
 * upon a request to deploy a token being made on the frontend because the request will undergo a thorough verification
 * process off-chain before being executed. Thus, after each restaurant clicks "Deploy Token" on /deploy-token, this contract
 * is not automatcially deployed -- rather, this contract will be manually deployed by the Decredify team after verifying the 
 * validity of the request being made. In the meantime to store the token deployment request's data, the data entered such as the 
 * token name and token symbol are stored on MongoDB in the token collection.
 * See https://rinkeby.etherscan.io/address/0xA5dB9152c234CE73fA47809ABA6AeE26DD544e9B for the contract on Etherscan
*/

// contracts/ModifiedAccessControl.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;


interface ERC20 {
    function totalSupply() external view returns (uint _totalSupply);
    function balanceOf(address _owner) external view returns (uint balance);
    function transfer(address _to, uint _value) external returns (bool success);
    event Transfer(address indexed _from, address indexed _to, uint _value);
}


contract Token is ERC20 {
    string public __symbol;
    string public __name;
    address public __owner;
    uint public __discount;
    uint8 public constant decimals = 0;
 
    // zeros
    uint private __totalSupply = 0;

    //this mapping iw where we store the balances of an address
    mapping (address => uint) private __balanceOf;

    // only owner can mint new tokens
    modifier isOwner() {
        require(msg.sender == __owner);
        _;
    }

    //the creator of the contract has the total supply and no one can create tokens
    constructor(address _address, string memory symbol, string memory name) public {
        __owner = _address;
        __symbol = symbol;
        __name = name;
        __discount = 20;
    }

    //change discount 
    function setDiscount(uint discount) public isOwner {
         __discount = discount;
    }

    //constant value that does not change/  returns the amount of initial tokens to display
    function totalSupply() public view override returns (uint _totalSupply) {
        _totalSupply = __totalSupply;
    }


    //returns the balance of a specific address
    function balanceOf(address _addr) public view override returns (uint balance) {
        return __balanceOf[_addr];
    }

    //gives to the owner of the contract the ability to mint additional tokens
    function mint(uint _value) isOwner public {
        __totalSupply += _value;
        __balanceOf[msg.sender] += _value;
    }
    

    //transfer an amount of tokens to another address
    function transfer(address _to, uint _value) public override returns (bool success) {
        if (_value > 0 && _value <= balanceOf(msg.sender)) {
            __balanceOf[msg.sender] -= _value;
            __balanceOf[_to] += _value;
            emit Transfer(msg.sender, _to, _value);
            return true;
        }
        return false;
    }

    //use reward when making a payement to get a discount
    function reedemRewards(uint price) public returns (uint discounted_price){
       uint nb_tokens = balanceOf(msg.sender);
       uint price_in_token = (price*100/__discount);

       if (price_in_token > nb_tokens) {
           transfer(__owner, nb_tokens);
           discounted_price = uint(price - nb_tokens*__discount/100);
       } else {
           transfer(__owner, price_in_token);
           discounted_price = 0;
       }
       return discounted_price;
   }

    //earn rewards after making a payement (in cash)
    function giveRewards(uint cash, address adress_customer) public isOwner {
       uint nb_tokens = cash;
       mint(nb_tokens);
       transfer(adress_customer, nb_tokens);
   }

}