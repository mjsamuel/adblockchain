const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'localhost', port: 5001, protocol: 'http' });
const decoder = new TextDecoder('utf-8');

class Ipfs {
    constructor() {
        this.ipnsAddress = '/ipns/QmWt5NiTyRwWWJy8EA12VuPvuvgGn8g3265FRahKTpwo6o';
        this.ipnsKey = 'QmWt5NiTyRwWWJy8EA12VuPvuvgGn8g3265FRahKTpwo6o';
    }

    async getAddress(domainName) {
        // Retrieve hash based on domain
        const targetHash = await this.retrieveHash(domainName);

        // Retrieve and parse data into JSON object
        console.log('Retrieving address...');
        const returnedData = await ipfs.cat(targetHash)
            .catch(console.error)
            .then(data => JSON.parse(data));

        console.log('Retrieved address for %s', returnedData.domainName);
        return returnedData.publicKey;
    }

    async addDomain(domainName, publicKey, privateKey) {
        // Create domain data as JSON string
        const domainData = JSON.stringify({ "domainName": domainName, "publicKey": publicKey, "privateKey": privateKey });

        // Wait for the data to be added to ipfs and store the returned hash address
        const hashAddress = await ipfs.add(domainData)
            .catch(console.error)
            .then(hash => hash.path);

        console.log('Generated hash: %s', hashAddress);

        // Afterwards store the hash address in IPNS
        this.storeHash(domainName, hashAddress);
    }

    // Function retrieves the most recent revision of the domain hash data using IPNS
    async retrieveLatestHashData() {
        // Retrieve the address of the most recent file version
        var ipfsAddress;
        for await (const name of ipfs.name.resolve(this.ipnsAddress)) {
            ipfsAddress = name;
        }

        // Retreive data from IPFS
        const source = ipfs.cat(ipfsAddress);
        var data = new String();
        for await (const chunk of source) {
            data += decoder.decode(chunk, { stream: true });
        }

        // Quick work-around for JSON string data being prefixed with 'undefined'
        if (data.startsWith("undefined")) {
            data = data.replace("undefined", "");
        }

        console.log('Retrieved lastest hash data: %s', data);
        return data;
    }

    async storeHash(domainName, hashAddress) {
        const hashData = JSON.stringify({ "domainName": domainName, "hashAddress": hashAddress });

        // Retrieve the existing domain hash data as a JSON object
        const existingData = await this.retrieveLatestHashData();

        // Append new data
        // const latestData = "{" + existingData + "," + hashData + "}";

        // Append the new hash to the existing data, and then convert it to a JSON string
        const latestAddress = await ipfs.add(latestData)
            .catch(console.error)
            .then(hash => hash.path)

        console.log('Appended new data to address: %s', latestAddress)

        // Publish the address to IPNS to update the pointer to the latest data
        const ipfsAddress = '/ipfs/' + latestAddress;
        const ipnsOptions = { 'allowOffline': true, 'key': this.ipnsKey };
        await ipfs.name.publish(ipfsAddress, ipnsOptions).catch(console).then(res => console.log('Published to IPNS: /ipns/%s', res.name));
    }

    async retrieveHash(domainName) {
        // Retrieve the existing hash data and access
        const existingData = await this.retrieveLatestHashData();

        // const hashAddress = existingData[domainName];

        // if (hashAddress == undefined) {
        //     throw 'Failed to find hash address for given domain: ' + domainName;
        // } else {
        //     return hashAddress;
        // }
    }
}

export default Ipfs;