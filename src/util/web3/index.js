import { EventEmitter } from 'events';

// Module
const startWeb3 = () => {

  // Tiny Crypto Place
  const tinyCrypto = {

    warn: {},

    connected: false,
    providerConnected: false,
    protocol: null,

    constants: Object.freeze({
      HexZero: '0x0000000000000000000000000000000000000000000000000000000000000000'
    }),

    call: {},
    get: {},
    contracts: {},

    errors: Object.freeze({
      noWallet: () => new Error('No wallet connected detected.'),
      noProvider: () => new Error('No provider connected detected.'),
    }),

    decimals: Object.freeze({
      0: 'wei',
      3: 'kwei',
      6: 'mwei',
      9: 'gwei',
      12: 'microether',
      15: 'milliether',
      18: 'ether',
      21: 'kether',
      24: 'mether',
      27: 'gether',
      30: 'tether',
    }),

  };

  // Check if Web3 has been injected by the browser (Mist/MetaMask).
  if (typeof ethereum !== 'undefined' && window.ethereum.isMetaMask) {

    // Emitter
    class MyEmitter extends EventEmitter { }
    const myEmitter = new MyEmitter();

    tinyCrypto.on = (where, callback) => myEmitter.on(where, callback);

    tinyCrypto.once = (where, callback) => myEmitter.once(where, callback);

    tinyCrypto.on = Object.freeze(tinyCrypto.on);
    tinyCrypto.once = Object.freeze(tinyCrypto.once);

    // Calls

    // Account Change
    tinyCrypto.call.accountsChanged = new Promise((resolve, reject) => {
      tinyCrypto.get.signerAddress().then(address => {

        tinyCrypto.address = address;
        if (tinyCrypto.address) {

          if (localStorage) {
            localStorage.setItem('web3_address', tinyCrypto.address);
          }

          tinyCrypto.accounts = accounts;
          myEmitter.emit('accountsChanged', accounts);
          resolve(accounts);

        }

      }).catch(reject);

    });

    // Get Signer Address
    tinyCrypto.get.signerAddress = (index = 0) => new Promise((resolve, reject) => {
      tinyCrypto.call.requestAccounts().then(accounts => {

        if (Array.isArray(accounts) && accounts.length > 0 && typeof accounts[index] === 'string') {
          resolve(accounts[index]);
        }

        else {
          resolve(null);
        }

      }).catch(reject);
    });

    // Network Changed
    tinyCrypto.call.networkChanged = (networkId) => {

      tinyCrypto.networkId = networkId;

      if (localStorage) {
        localStorage.setItem('web3_network_id', networkId);
      }

      myEmitter.emit('networkChanged', networkId);

    };

    // Request Account
    tinyCrypto.call.requestAccounts = () => new Promise((resolve, reject) => {
      tinyCrypto.provider.eth.requestAccounts().then(accounts => {

        // Address
        if (Array.isArray(accounts) && accounts.length > 0) {
          for (const item in accounts) {
            accounts[item] = accounts[item].toLowerCase();
          }
        }

        tinyCrypto.accounts = accounts;
        tinyCrypto.connected = true;

        myEmitter.emit('requestAccounts', accounts);
        resolve(accounts);

      }).catch(err => {
        tinyCrypto.connected = false;
        reject(err);
      });
    });

    // Check Connection
    tinyCrypto.call.checkConnection = () => new Promise((resolve, reject) => {
      if (tinyCrypto.providerConnected) {
        tinyCrypto.provider.eth.getAccounts().then(accounts => {

          // Address
          if (Array.isArray(accounts) && accounts.length > 0) {
            for (const item in accounts) {
              accounts[item] = accounts[item].toLowerCase();
            }
          }

          tinyCrypto.accounts = accounts;

          // Check Address
          if (tinyCrypto.existAccounts()) {

            tinyCrypto.get.signerAddress().then(address => {

              tinyCrypto.address = address;

              myEmitter.emit('checkConnection', { address, accounts });
              resolve(address);

            }).catch(reject);

          }

          else {
            resolve(false);
          }

        });
      }
      else {
        reject(tinyCrypto.errors.noProvider());
      }

    });

    // Wait Address
    tinyCrypto.call.waitAddress = () => new Promise((resolve, reject) => {

      try {

        if (tinyCrypto.address) {
          resolve(tinyCrypto.address);
        }

        else {
          setTimeout(() => {
            tinyCrypto.call.waitAddress().then(data => { resolve(data); }).catch(reject);
          }, 500);
        }

      }

      catch (err) { reject(err); }

    });

    // Execute Contract
    tinyCrypto.call.executeContract = (contract, abi, data, gasLimit = 100000) => new Promise((resolve, reject) => {
      if (tinyCrypto.connected) {

        // Loading
        tinyCrypto.get.signerAddress().then(address => {
          tinyCrypto.address = address;
          tinyCrypto.provider.eth.getTransactionCount(address).then(nonce => {
            tinyCrypto.provider.eth.getGasPrice().then(currentGasPrice => {

              // construct the transaction data
              const tx = {

                nonce,
                gasLimit: tinyCrypto.provider.utils.toHex(gasLimit),

                // eslint-disable-next-line radix
                gasPrice: tinyCrypto.provider.utils.toHex(parseInt(currentGasPrice)),

                from: address,
                to: contract,
                value: tinyCrypto.constants.HexZero,
                data: tinyCrypto.provider.eth.abi.encodeFunctionCall(abi, data),

              };

              // Complete
              tinyCrypto.provider.eth.sendTransaction(tx).then(resolve).catch(reject);

            }).catch(reject);
          }).catch(reject);
        }).catch(reject);

      }

      else { reject(tinyCrypto.errors.noWallet()); }

    });

    // Read Contract
    tinyCrypto.call.readContract = (contract, functionName, data, abi) => new Promise((resolve, reject) => {

      if (!tinyCrypto.contracts[contract] && abi) {
        tinyCrypto.contracts[contract] = new tinyCrypto.provider.eth.Contract(abi, contract);
      }

      if (tinyCrypto.contracts[contract]) {
        tinyCrypto.contracts[contract].methods[functionName].apply(tinyCrypto.contracts[contract], data).call().then(resolve).catch(reject);
      }

      else {
        resolve(null);
      }

    });

    // Send Payment
    tinyCrypto.call.sendTransaction = (amount, address, contract = null, gasLimit = 100000) => new Promise((resolve, reject) => {

      if (tinyCrypto.connected) {

        // Result
        tinyCrypto.get.signerAddress().then(mainWallet => {

          // Address
          const tinyAddress = address.toLowerCase();

          // Token Mode
          if (contract) {

            // Contract Value
            let tinyContract = contract;

            // Connect to the contract
            if (typeof tinyContract === 'string') { tinyContract = { value: contract, decimals: 18 }; }
            if (typeof tinyContract.value !== 'string') { tinyContract.value = ''; }
            if (typeof tinyContract.decimals !== 'number') { tinyContract.decimals = 18; }

            // Transaction
            tinyCrypto.call.executeContract(tinyContract.value, {
              type: 'function',
              name: 'transfer',
              stateMutability: 'nonpayable',
              payable: false,
              constant: false,
              outputs: [{ type: 'uint8' }],
              inputs: [{
                name: '_to',
                type: 'address'
              }, {
                name: '_value',
                type: 'uint256'
              }]
            }, [
              tinyAddress,
              tinyCrypto.provider.utils.toWei(String(amount), tinyCrypto.decimals[tinyContract.decimals])
            ], gasLimit).then(resolve).catch(reject);

          }

          // Normal Mode
          else {
            tinyCrypto.provider.eth.sendTransaction({
              from: mainWallet,
              to: tinyAddress,
              value: tinyCrypto.provider.utils.toWei(String(amount)),
            }).then(resolve).catch(reject);
          }

        }).catch(reject);

      }

      else {
        reject(tinyCrypto.errors.noWallet());
      }

    });

    // Sign
    tinyCrypto.call.sign = (msg = '', password = '') => new Promise((resolve, reject) => {

      if (tinyCrypto.connected) {
        tinyCrypto.get.signerAddress().then(address => {

          tinyCrypto.address = address;
          if (address) {
            tinyCrypto.provider.eth.personal.sign(tinyCrypto.provider.utils.utf8ToHex(msg), address, password).then(resolve);
          }

          else {
            resolve(null);
          }

        }).catch(reject);
      }

      else {
        reject(tinyCrypto.errors.noWallet());
      }

    });

    // Data
    tinyCrypto.get.provider = () => tinyCrypto.provider;
    tinyCrypto.get.address = () => tinyCrypto.address;
    tinyCrypto.get.call = () => tinyCrypto.call;
    tinyCrypto.get.config = () => window.clone(tinyCrypto.config);

    // Exist Accounts
    tinyCrypto.existAccounts = () => Array.isArray(tinyCrypto.accounts) && tinyCrypto.accounts.length > 0;

    // Insert Provider
    // eslint-disable-next-line no-undef
    tinyCrypto.provider = new Web3(window.ethereum);
    tinyCrypto.providerConnected = true;

    // Insert Protocol
    tinyCrypto.protocol = 'metamask';

    // Change Account Detector
    window.ethereum.on('accountsChanged', accounts => {
      tinyCrypto.call.accountsChanged(accounts);
    });

    // Network Change
    window.ethereum.on('networkChanged', networkId => {
      tinyCrypto.call.networkChanged(networkId);
    });

    // Ready Provider and check the connection
    tinyCrypto.call.checkConnection().then(() => {
      myEmitter.emit('readyProvider');
    });

  }

  // Freeze
  tinyCrypto.call = Object.freeze(tinyCrypto.call);
  tinyCrypto.get = Object.freeze(tinyCrypto.get);

  // Insert into global
  global.tinyCrypto = tinyCrypto;

};

// Export Module
export { startWeb3 };
