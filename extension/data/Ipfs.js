const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'localhost', port: 5001, protocol: 'http' });
const decoder = new TextDecoder('utf-8');

class Ipfs {
    constructor() {
        this.ipnsAddress = '/ipns/QmWt5NiTyRwWWJy8EA12VuPvuvgGn8g3265FRahKTpwo6o';
        this.ipnsKey = 'QmWt5NiTyRwWWJy8EA12VuPvuvgGn8g3265FRahKTpwo6o';
        this.emptyDataStructure = JSON.stringify({
            addresses: []
        });
    }

    async getAddress(domainName) {
        // Retrieve hash based on target domain
        const targetHash = await this.retrieveHash(domainName);

        // Retrieve and decode data from retrieved hash
        var data = await this.readData(targetHash)
            .catch(console.error)
            .then(console.log('Retrieved address for domain: %s', domainName));

        // Return the public key of the data
        return JSON.parse(data).publicKey;
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

        // Attempt to decode the source.
        // Because IPNS data lasts for 24hrs only, the code below enclosed in try statement will fail and throw an error
        // if the cat operation returns nothing.
        var data;
        try {
            data = await this.readData(ipfsAddress);
            console.log('Retrieved lastest hash data: %s', data);
        }
        // If this happens catch the error and set data = an empty data structure
        catch (err) {
            data = this.emptyDataStructure;
        }

        // Return the data as a JSON object.
        return JSON.parse(data);
    }

    async storeHash(domainName, hashAddress) {
        // New hash entry
        const newHashData = { "domainName": domainName, "hashAddress": hashAddress };

        // Retrieve the existing domain hash data as a JSON object
        const hashData = await this.retrieveLatestHashData();

        // Append new data to the existing data
        hashData.addresses.push(newHashData);

        // Convert the data to a JSON string and add it to IPFS
        const latestAddress = await ipfs.add(JSON.stringify(hashData))
            .catch(console.error)
            .then(hash => hash.path)

        console.log('Appended new data to address: %s', latestAddress)

        // Publish the address to IPNS to update the pointer to the latest data
        const ipfsAddress = '/ipfs/' + latestAddress;
        const ipnsOptions = { 'allowOffline': true, 'key': this.ipnsKey };
        await ipfs.name.publish(ipfsAddress, ipnsOptions)
            .catch(console)
            .then(res => console.log('Published to IPNS: /ipns/%s', res.name));
    }

    async retrieveHash(domainName) {
        // Retrieve the existing hash data and access
        const existingData = await this.retrieveLatestHashData();

        // Retrieve all hash data for all domains as an array
        const allDomains = existingData.addresses;

        // Iterate over the array until the target domain is found
        for (let step = 0; step < allDomains.length; step++) {
            // If found return the hash address
            if (allDomains[step].domainName == domainName) {
                return allDomains[step].hashAddress;
            }
        }

        // If nothing is found, then throw an error
        throw "No record found for domain: " + domainName;
    }

    async readData(hashAddress) {
        // Retrieve data from IPFS
        const source = await ipfs.cat(hashAddress);
        var data = "";

        // Decode data into string
        for await (const chunk of source) {
            data += decoder.decode(chunk, { stream: true });
        }

        // Data returned is prefixed with 'undefined' for an unknown reason
        // This removes it so the data can be used
        if (data.startsWith("undefined")) {
            data = data.replace("undefined", "");
        }

        return data;
    }
}

export default Ipfs;