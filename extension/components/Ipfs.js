import React, {Component} from 'react'
const IPFS = require('ipfs-mini');

class Ipfs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ipfs: null
        };
    }

    componentWillMount() {
        this.configureIPFS();
    }

    configureIPFS(){
        const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
        this.setState({ipfs: ipfs});
    }

    getAddress(domainName) {
        // retrieve hash ID from .csv/.txt file for known websites?
        const hashID = "";

        this.state.ipfs.cat(hashID, (err, data) => {
            if(err){
                console.log(err);
            } else {
                console.log("Retrieving address: " + data.publicKey + " for domain: " + data.domainName);
                return data.publicKey;
            }
        });
    }

    addDomain(domainName, publicKey, privateKey) {
        const domainData = JSON.parse({
            domainName: domainName,
            publicKey: publicKey,
            privateKey: privateKey
        });

        this.state.ipfs.addJSON(domainData, (err, hash) => {
            if(err) {
                console.log(err);
            } else {
                console.log("Generated hash: " + hash);
                // add to .csv/.txt file?
            }
        })
    }
}