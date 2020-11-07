const ipfsClient = require('ipfs-http-client');

import { IPNS_ADDRESS, IPNS_KEY } from '../../config.js';

export class IPFS {
    constructor() {
        this.LOCAL_DATABASE_KEY = "localDatabase"
        this.ipfs = ipfsClient({ host: 'localhost', port: 5001, protocol: 'http' });
        this.decoder = new TextDecoder('utf-8');
    }

    /**
     * Retrieves the Ethereum public key, private key and cost per view from our 
     # local cache. If this data doesn't exist then check the IPFS instead.
     * @param {String} domainName - the domain that you want the public key of  
     * @return {Object} - the corresponding domain object
     */
    async getDomainData(domainName) {
        // First attempt to retrieve the domain data from local storage
        var domainData = await this.getLocalDomainData(domainName)

        // If data doesn't exist in local storage then consult IPFS
        if(domainData == null) {
            const database = await this.getDatabse();
            domainData = database[domainName];
        }

        return domainData;
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
        // Retrieve the entire IPFS database and add the new domain
        var database = await this.getDatabse();
        database[domainName] = {
            "publicKey": publicKey,
            "privateKey": privateKey,
            "cpv": 0.20
        }

        // Convert JSON to string and push the changes to the IPFS database
        const databaseString = JSON.stringify(database);
        this.updateDatabase(databaseString);
        
        // Update local storage as well
        this.updateLocalDatabase(databaseString)

        return database[domainName];
    }

    /**
     * Updates the cost per page view for a specific domain
     * @param {String} domainName - the URL of the domain you want to update
     * @param {Int} cost - the updated cost-per-view for that domain
     */
    async updateCost(domainName, cost) {
        var database = await this.getDatabse();
        database[database].cpv = cost

        // Convert JSON to string and push the changes to the IPFS database
        const databaseString = JSON.stringify(database);
        this.updateDatabase(databaseString);
        
        // Update local storage as well
        this.updateLocalDatabase(databaseString)
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

    async getLocalDomainData(domainData) {
        const databaseString = await localStorage.getItem(this.LOCAL_DATABASE_KEY);
        const database = JSON.parse(databaseString);

        return database[domainData]
    }

    async updateLocalDatabase(databaseString) {
        localStorage.setItem(this.LOCAL_DATABASE_KEY, databaseString);
    }

    /**
     * Helper function to clear the IPFS and local database
     */
    async clearDatabase() {
        this.updateDatabase('{}');
        this.updateLocalDatabase('{}');
    }
}
