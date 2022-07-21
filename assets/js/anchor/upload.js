import {encrypt} from "../lit/encrypt";
import {shdw} from "../shdw";
import LitJsSdk from "lit-js-sdk";
import {textDecoder, textEncoder} from "./util";

export async function upload(program, provider, ledger) {
    try {
        // fetch mint for encryption auth
        const _state = await program.account.ledger.fetch(ledger);
        const mint = _state.auth.toString();
        // select files
        const files = document.getElementById("gg-sd-zip").files;
        // invoke encryption
        const encrypted = await encrypt(mint, files);
        // upload blob to shdw drive
        const fileName = "encrypted.zip"
        const file = new File([encrypted.encryptedZip], fileName)
        //const file = new File(['hello', ' ', 'world'], fileName, {type: 'text/plain'});
        const url = await shdw(provider.wallet, file);
        const prefix = url.replace(fileName, "");
        console.log(prefix);
        console.log(url);
        // invoke rpc
        console.log(encrypted.encryptedSymmetricKey);
        console.log(Buffer.from(encrypted.encryptedSymmetricKey));
        console.log(Buffer.from(prefix));
        const encodedPrefix = textEncoder.encode(prefix);
        console.log(prefix);
        console.log(Buffer.from(encodedPrefix));
        await program.rpc.publishAssets(Buffer.from(encrypted.encryptedSymmetricKey), Buffer.from(encodedPrefix), {
            accounts: {
                ledger: ledger,
                boss: provider.wallet.publicKey,
            }
        });
        const __state = await program.account.ledger.fetch(ledger);
        console.log(__state);
        // encode arrays as base64
        // const prefix2 = encodeBase64(__state.assets.url);
        console.log(__state.assets.url);
        const prefix2 = textDecoder.decode(new Uint8Array(__state.assets.url));
        console.log(prefix2)
        const encryptedHexKey = LitJsSdk.uint8arrayToString(encrypted.encryptedSymmetricKey, "base16");
        const key = __state.assets.key;
        console.log(key);
        console.log (typeof key);
        const encryptedHexKey2 = LitJsSdk.uint8arrayToString(new Uint8Array(__state.assets.key), "base16");
        console.log(encryptedHexKey);
        console.log(encryptedHexKey2);
        // decrypt assets
        // const encryptedZip = fetch(prefix2 + fileName);
        // or catch error
    } catch (error) {
        console.log(error)
        app.ports.genericErrorListener.send(error.toString());
    }
}
