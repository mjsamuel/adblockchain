const IPFS = require('ipfs-mini');
const csv = require('csv-parser');
const fs = require('browserify-fs');

class Ipfs {
    constructor() {
        this.ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        this.recordsPath = "records.csv";
    }

    getAddress(domainName) {
        const hashAddress = this._retrieveHashAddress(domainName);

        this.ipfs.cat(hashAddress, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Retrieving address: " + data.publicKey + " for domain: " + data.domainName);
                return data.publicKey;
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
                this._createRecord(domainName, hash)
            }
        })
    }

    _retrieveHashAddress(domainName) {
        fs.createReadStream('domain_data.csv').
            pipe(csv()).
            on('data', (row) => {
                if (row.domain == domainName) {
                    console.log('Parsed hash address for domain: %s', domainName);
                    return row.address;
                }
            });

        console.log('Failed to find hash address for domain: %s', domainName);
    }

    _createRecord(domainName, hashAddress) {
        const newRecord = domainName.concat(",", hashAddress);
        fs.appendFile("records.csv", newRecord, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Appended new record: %s', newRecord)
            }
        });
    }
}

export default Ipfs;