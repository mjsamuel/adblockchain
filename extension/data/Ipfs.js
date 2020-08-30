const IPFS = require('ipfs-mini');
const ipns = require('ipns')
const crypto = require('libp2p-crypto')

class Ipfs {
    constructor() {
        this.ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        this.validator = ipns.validator
    }

    async getAddress(domainName) {
        // Retrieve hash based on domain
        const targetHash = await this.retrieveHash(domainName);

        // Retrieve and parse data into JSON object
        console.log('Retrieving address...');
        const returnedData = await this.ipfs.cat(targetHash)
            .catch(console.error)
            .then(data => JSON.parse(data));

        console.log('Retrieved address for %s', returnedData.domainName)
        return returnedData.publicKey;
    }

    async addDomain(domainName, publicKey, privateKey) {
        // Convert data into JSON object.
        const domainData = JSON.stringify({ "domainName": domainName, "publicKey": publicKey, "privateKey": privateKey });
        const dataObject = JSON.parse(domainData);

        // Wait for data object to be added to IPFS 
        console.log('Adding domain...')
        await this.ipfs.addJSON(dataObject)
            .catch(console.error)
            .then(hash => console.log('Generated hash: %s', hash));
    }

    async storeHash(hashAddress) {
        // Retrieve current data

        // Create temp JSON object with new data appended

        // Add new data to IPFS

        // Generate key pair

        // Publish data to IPNS



        const keyPair = await crypto.keys.generateKeyPair('RSA', 1024);

        const ipnsEntry = await ipns.create(keyPair, hashAddress, 4, 33333);

        await this.validator.validate(ipns.marshal(ipnsEntry), keyPair).catch(console.error).then(result => console.log(result))
        // const result = await ipns.validate(keyPair, ipnsEntry).catch(console.error).then(test => console.log(test));


        // const result = await ipns.validate(keyPair, entry);
        // console.log(result)



        // await ipns.create()
        // TODO: ipns
    }

    async retrieveHash(domainName) {
        // TODO: ipns
        return "QmWrn6iHUgTkrXZndeSfoq8fDyVWfNs8PhrPRXB2p8DZoQ";
    }
}

export default Ipfs;