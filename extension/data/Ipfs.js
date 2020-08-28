const IPFS = require('ipfs-mini');
const csv = require('csv-parser');
const fs = require('browserify-fs');

class Ipfs {
    constructor() {
        this.ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        this.recordsPath = "records.csv";
    }

    getAddress(domainName) {
        this.ipfs.cat('QmWrn6iHUgTkrXZndeSfoq8fDyVWfNs8PhrPRXB2p8DZoQ', (err, result) => {
            if (err) {
                console.log(err);
            } else {
                const returnedData = JSON.parse(result)
                console.log("Retrieving address: " + returnedData.publicKey + " for domain: " + returnedData.domainName);

            }
        });
    }

    addDomain(domainName, publicKey, privateKey) {
        const domainData = JSON.stringify({ "domainName": domainName, "publicKey": publicKey, "privateKey": privateKey });
        const dataObject = JSON.parse(domainData);

        this.ipfs.addJSON(dataObject, (err, hash) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Generated hash: " + hash)
            }
        })
    }

}

export default Ipfs;