const ipfsClient = require('ipfs-http-client');

import { IPNS_ADDRESS, IPNS_KEY } from '../../config.js';

export class IPFS {
    constructor() {
        this.ipfs = ipfsClient({ host: 'localhost', port: 5001, protocol: 'http' });
        this.decoder = new TextDecoder('utf-8');
    }

    /**
     * Gets the Ethereum public key, private key and cost per view from our IPFS 
     * database
     * @param {String} domainName - the domain that you want the public key of  
     * @return {Object} - the corresponding domain object
     */
    async getDomainData(domainName) {
        // First attempt to retrieve the domain data from local storage
        const cachedData = localStorage.getItem(domainName);

        // If successful, return the cached data
        if(cachedData) {
            return cachedData;
        } 
        // Else search the database for it
        else {
            // Retrieve the entire database as a string
            const database = await this.getDatabse();
            const domainData = database[domainName];
            return domainData;
        }
    }

    /**
     * Retrieves the most recent revision of the database using IPNS
     * @return {Object} - the database object
     */
    async getDatabse() {
        // Retrieve the address of the most recent database version
        var ipfsAddress;
        for await (const name of this.ipfs.name.resolve(IPNS_ADDRESS)) {
            ipfsAddress = name;
        }

        // Retrieve the database from IPFS
        const source = await this.ipfs.cat(ipfsAddress);
        var data = '';
        for await (const chunk of source) {
            data += this.decoder.decode(chunk, { stream: true });
        }

        // Return the data as a JSON object.
        return JSON.parse(data);
    }

    /**
     * Adds a new domain to the IPFS database
     * @param {String} domainName - the URL of the domain you want to add
     * @param {String} publicKey - the Ethereum public key for that domain
     * @param {String} privateKey - the Ethereum private key for that domain
     * @return {Object} - the newly created domain object
     */
    async addDomain(domainName, publicKey, privateKey) {
        // Retrieve the entire database as a string
        var database = await this.getDatabse();
        
        // Add the domain data to the database and stringify
        database[domainName] = {
            "publicKey": publicKey,
            "privateKey": privateKey,
            "cpv": 0.20
        }

        // Convert to JSON string and push the changes to the database
        const databaseString = JSON.stringify(database);
        this.updateDatabase(databaseString);
        
        // Store entry into local storage
        localStorage.setItem(domainName, databaseString);
        
        return database[domainName];
    }

    /**
     * Updates the cost per page view for a specific domain
     * @param {String} domainName - the URL of the domain you want to update
     * @param {Int} cost - the updated cost-per-view for that domain
     */
    async updateCost(domainName, cost) {
        // Retrieve the current data for the given domain
        const domainData = JSON.parse(await this.getDomainData(domainName));
        
        // Update the CPV value locally
        domainData[domainName].cpv = cost;
        
        // Retrieve the latest data and replace the entry with our updated domain data
        const currentData = await this.getDatabse();
        currentData[domainName] = domainData;

        // Convert the updated data object into a JSON string before adding the changes to the database
        const updatedData = JSON.stringify(currentData);
        this.updateDatabase(updatedData);

        // Update entry into local storage (or creates it if it no longer exists)
        localStorage.setItem(domainName, updatedData);
    }

    /**
     * Updates the IPFS pointer to our newly updated database
     * @param {String} databaseString - the updated database as a string
     */
    async updateDatabase(databaseString) {
        // Wait for the data to be added to IPFS and store the returned hash address
        const newIpfsAddress = await this.ipfs.add(databaseString);

        // Publish the address to IPNS to update the pointer to the latest data
        const ipnsOptions = { 'allowOffline': true, 'key': IPNS_KEY };
        await this.ipfs.name.publish(newIpfsAddress.path, ipnsOptions);
    }

    /**
     * Helper function to clear the IPFS database
     */
    async clearDatabase() {
        this.updateDatabase('{}');
    }
}
