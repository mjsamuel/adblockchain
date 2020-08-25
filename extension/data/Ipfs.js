import React from "react";
const IPFS = require('ipfs-mini');
const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class Ipfs {
    constructor() {
        this.ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        this.csvWriter = createCsvWriter({
            path: 'domain_data.csv',
            header: [
                { id: 'domain', title: 'Domain' },
                { id: 'address', title: 'Hash' },
            ]
        });
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
                this._storeDomainHash(domainName, hash)
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

    _storeDomainHash(domainName, hashAddress) {
        const domainData = [{ domain: domainName, address: hashAddress }]
        this.csvWriter.writeRecords(domainData).then(() => console.log('Appended domain: %s to CSV file.', domainName))
    }
}

export default Ipfs;