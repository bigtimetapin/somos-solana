import {encrypt} from "../lit/encrypt";
import {decrypt} from "../lit/decrypt";
import {saveAs} from 'file-saver';
import JSZip from "jszip";
import {apply} from "../shdw";

export async function upload(program, provider, ledger) {
    try {
        // fetch mint for encryption auth
        //const _state = await program.account.ledger.fetch(ledger);
        //const mint = _state.auth.toString();
        //// select files
        //const files = document.getElementById("gg-sd-zip").files;
        //console.log(files);
        //// invoke encryption
        //const encrypted = await encrypt(mint, files);
        //// invoke rpc
        ////await program.rpc.publishAssets(Buffer.from(encrypted.encryptedHexKey), {
        ////    accounts: {
        ////        ledger: ledger,
        ////        boss: provider.wallet.publicKey,
        ////    }
        ////});
        ////console.log("asset identifiers uploaded to solana program");
        //const decrypted = await decrypt(mint, encrypted.encryptedHexKey, encrypted.encryptedZip);
        //// convert back to zip
        //const zip = new JSZip();
        //zip.files = decrypted;
        //// download
        //zip.generateAsync({type: "blob"})
        //    .then(function (blob) {
        //        saveAs(blob, "hello.zip");
        //    });
        //// or catch error
        await apply(provider.wallet);
    } catch (error) {
        console.log(error)
        app.ports.genericErrorListener.send(error.toString());
    }
}
