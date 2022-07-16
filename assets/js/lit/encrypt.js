import LitJsSdk from 'lit-js-sdk'
import {chain} from "./config";
import {solRpcConditions} from "./util";


export async function encrypt(mint, files) {
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

    console.log("encrypting files")
    const {encryptedZip, symmetricKey} = await LitJsSdk.zipAndEncryptFiles(
        files
    );
    console.log("key: " + symmetricKey.toString());

    console.log("pushing key to network")
    const encryptedSymmetricKey = await client.saveEncryptionKey({
        solRpcConditions: solRpcConditions(mint),
        chain: chain,
        authSig: authSig,
        symmetricKey: symmetricKey,
        permanent: true
    });
    console.log("before hex: " + encryptedSymmetricKey.toString());
    console.log("length: " + encryptedSymmetricKey.length.toString());
    // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string.
    // This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" which returns a UInt8Array.
    // But the getEncryptionKey method expects a hex string.
    const encryptedHexKey = LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16");
    console.log("hex key: " + encryptedHexKey);
    console.log("length: " + encryptedHexKey.length.toString());
    return {encryptedHexKey, encryptedZip}
}
