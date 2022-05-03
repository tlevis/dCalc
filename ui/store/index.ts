export const state = () => ({
    contractAddress: '0xb837Bd1a20258ada5B1594a7bb4Ff6fBedFf76cA',
    contractABI: [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "int256",
                    "name": "_x",
                    "type": "int256"
                },
                {
                    "internalType": "int256",
                    "name": "_y",
                    "type": "int256"
                }
            ],
            "name": "add",
            "outputs": [
                {
                    "internalType": "int256",
                    "name": "",
                    "type": "int256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "checkUser",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "int256",
                    "name": "_x",
                    "type": "int256"
                },
                {
                    "internalType": "int256",
                    "name": "_y",
                    "type": "int256"
                }
            ],
            "name": "div",
            "outputs": [
                {
                    "internalType": "int256",
                    "name": "",
                    "type": "int256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "healthCheck",
            "outputs": [
                {
                    "internalType": "int8",
                    "name": "",
                    "type": "int8"
                }
            ],
            "stateMutability": "pure",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "int256",
                    "name": "_x",
                    "type": "int256"
                },
                {
                    "internalType": "int256",
                    "name": "_y",
                    "type": "int256"
                }
            ],
            "name": "mul",
            "outputs": [
                {
                    "internalType": "int256",
                    "name": "",
                    "type": "int256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "refund",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "register",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "registeredAddresses",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "valid",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "registrationDate",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "int256",
                    "name": "_x",
                    "type": "int256"
                },
                {
                    "internalType": "int256",
                    "name": "_y",
                    "type": "int256"
                }
            ],
            "name": "sub",
            "outputs": [
                {
                    "internalType": "int256",
                    "name": "",
                    "type": "int256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }
    ],
    buttons: ['7', '8', '9', '÷', '4', '5', '6', 'x', '1', '2', '3', '+', 'C', '0', '⌫', '-', '='],
});

export const mutations = {};

export const actions = {};

export const getters = {
    getContractAddress: (state: any) => {
        return state.contractAddress;
    },

    getABI: (state: any) => {
        return state.contractABI;
    },

    getButtons: (state: any) => {
        return state.buttons;
    },
};
