import {network} from "../anchor/config";

export let chain = null;
if (network === "https://api.mainnet-beta.solana.com") {
    chain = "solana";
} else if (network === "https://api.devnet.solana.com") {
    chain = "solanaDevnet";
} else {
    const msg = "could not configure lit chain with solana network: " + network
    app.ports.genericErrorListener.send(msg);
}
