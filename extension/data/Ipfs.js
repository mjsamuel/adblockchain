const IPFS = require('ipfs-mini');

class Ipfs {
    constructor() {
        this.ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
    }

    async getAddress(domainName) {
        // Retrieve hash based on domain
        const hash = "QmWrn6iHUgTkrXZndeSfoq8fDyVWfNs8PhrPRXB2p8DZoQ";

        console.log('Retrieving data...');
        const returnedData = await this.ipfs.cat(hash)
            .catch(console.error)
            .then(data => JSON.parse(data));

        console.log('Returned data for %s', returnedData.domainName)
        return returnedData.publicKey;
    }

    async addDomain(domainName, publicKey, privateKey) {
        // Convert data into JSON object.
        const domainData = JSON.stringify({ "domainName": domainName, "publicKey": publicKey, "privateKey": privateKey });
        const dataObject = JSON.parse(domainData);

        // Wait for the data to be stored.
        console.log('Storing domain data...')
        await this.ipfs.addJSON(dataObject)
            .catch(console.error)
            .then(hash => console.log('Generated hash: %s', hash));
    }

    async storeHash(domainName, hashAddress) {

    }

}

export default Ipfs;