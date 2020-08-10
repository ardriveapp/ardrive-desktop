// index.js
const Promise = require('bluebird')
const SmartWeave = require('smartweave')
const { selectWeightedPstHolder } = require('smartweave')

// Establish Arweave node connectivity.
const gatewayURL = "https://arweave.net/"
//const gatewayURL = "https://perma.online/"
const Arweave = require('arweave/node');
const arweave = Arweave.init({
    //host: 'perma.online', // ARCA Community Gateway
    host: 'arweave.net', // Arweave Gateway
    port: 443,
    protocol: 'https',
    timeout: 600000
});

// ArDrive Profit Sharing Community Smart Contract
const contractId = '4JDU_Ha3bMeFtDMy1HgKSB3UsmPbW_VCCLIp7Vi0rLE'

// Sends a fee (15% of transaction price) to ArDrive Profit Sharing Community holders
exports.sendArDriveFee = async function (user, arweaveCost) {
  return new Promise(async (resolve, reject) => {
      try {
          // Fee for all data submitted to ArDrive is 15%
          var fee = +arweaveCost * .15

          if (fee < .00001) {
              fee = .00001
          }

          // Probabilistically select the PST token holder
          const holder = await SmartWeave.readContract(arweave, contractId).then(contractState => {
              return SmartWeave.selectWeightedPstHolder(contractState.balances)
          })

          // send a fee. You should inform the user about this fee and amount.
          const transaction = await arweave.createTransaction({ target: holder, quantity: arweave.ar.arToWinston(fee) }, JSON.parse(user.jwk))
      
          // Sign file
          await arweave.transactions.sign(transaction, JSON.parse(user.jwk));

          // Submit the transaction
          const response = await arweave.transactions.post(transaction);
          
          if (response.status == "200" || response.status == "202")  {
              console.log("SUCCESS ArDrive fee of %s was submitted with TX %s", fee.toFixed(9), transaction.id)
              resolve (transaction.id)
          }
          else {
              console.log("ERROR submitting ArDrive fee with TX %s", transaction.id)
              resolve (transaction.id)
          }
      }
      catch (err) {
          console.log(err)
          reject ("ERROR sending ArDrive fee")
      }
  })
}