import LitJsSdk from 'lit-js-sdk'
import {chain} from "./config";
import {solRpcConditions} from "./util";


export async function encrypt(mint) {
    // build client
    const client = new LitJsSdk.LitNodeClient()
    // await for connection
    console.log("connecting to LIT network")
    await client.connect()

    document.addEventListener('lit-ready', function (e) {
        console.log('LIT network is ready')
        // replace this line with your own code that tells your app the network is ready
    }, false)

    console.log("invoking signature request")
    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: chain})

    console.log("encrypting string")
    const {encryptedString, symmetricKey} = await LitJsSdk.encryptString(
        "using lit protocol for decentralized auth"
    );

    console.log("key: " + symmetricKey.toString())

    console.log("pushing key to network")
    const encryptedSymmetricKey = await client.saveEncryptionKey({
        solRpcConditions: solRpcConditions(mint),
        chain: chain,
        authSig: authSig,
        symmetricKey: symmetricKey,
        permanent: true
    });

    return {encryptedSymmetricKey, encryptedString}
}
