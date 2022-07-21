import {solRpcConditions} from "./util";
import LitJsSdk from "lit-js-sdk";
import {chain} from "./config";
import JSZip from "jszip";

export async function decrypt(mint, encryptedSymmetricKey, encryptedZip) {
    // build client
    const client = new LitJsSdk.LitNodeClient();
    // await for connection
    console.log("connecting to LIT network");
    await client.connect();
    // client signature
    console.log("invoking signature request");
    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: chain});
    // get encryption key
    console.log("getting key from networking");
    // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string.
    // This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" which returns a UInt8Array.
    // But the getEncryptionKey method expects a hex string.
    const encryptedHexKey = LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16");
    const retrievedSymmetricKey = await client.getEncryptionKey({
        solRpcConditions: solRpcConditions(mint),
        toDecrypt: encryptedHexKey,
        chain,
        authSig
    });
    // decrypt file
    console.log("decrypting zip file");
    const decrypted = await LitJsSdk.decryptZip(
        encryptedZip,
        retrievedSymmetricKey
    );
    // convert back to zip
    const zip = new JSZip();
    zip.files = decrypted;
    // download
    console.log("download file")
    zip.generateAsync({type: "blob"})
        .then(function (blob) {
            saveAs(blob, "hello.zip");
        });
}
