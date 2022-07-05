import {web3, BN} from "@project-serum/anchor";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";

export async function init(program, provider, ledger, seed, user, n, price, resale) {
    try {
        // ephemeral keypair for auth
        let auth = new web3.Keypair();
        // compute price in lamports
        const priceInLamports = price * web3.LAMPORTS_PER_SOL
        // invoke rpc
        await program.rpc.initializeLedger(seed, new BN(n), new BN(priceInLamports), resale, {
            accounts: {
                user: provider.wallet.publicKey,
                ledger: ledger,
                auth: auth.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: web3.SystemProgram.programId,
                rent: web3.SYSVAR_RENT_PUBKEY,
            },
            signers: [auth]
        });
        // send state to elm
        app.ports.getCurrentStateListener.send(user);
        // log success
        console.log("program init success");
    } catch (error) {
        // log error
        console.log(error.toString());
        // send error to elm
        app.ports.initProgramFailureListener.send(error.message)
    }
}
