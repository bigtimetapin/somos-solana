import {web3, BN} from "@project-serum/anchor";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {AUTH_SEED} from "./config";

export async function init(program, provider, ledger, seed, user, n, price, resale) {
    try {
        // derive auth address
        let auth, _;
        [auth, _] = await web3.PublicKey.findProgramAddress(
            [seed, AUTH_SEED],
            TOKEN_PROGRAM_ID
        );
        // compute price in lamports
        const priceInLamports = price * web3.LAMPORTS_PER_SOL
        //const ix = [web3.SystemProgram.createAccount({
        //    fromPubkey: provider.wallet.publicKey,
        //    newAccountPubkey: auth.publicKey,
        //    space: 82,
        //    lamports:
        //        await connection.getMinimumBalanceForRentExemption(
        //            82
        //        ),
        //    programId: TOKEN_PROGRAM_ID,
        //})];
        //const tx = new web3.Transaction();
        //tx.add(...ix);
        //await provider.sendAndConfirm(tx, [auth]);
        await program.rpc.initializeLedger(seed, new BN(n), new BN(priceInLamports), resale, {
            accounts: {
                user: provider.wallet.publicKey,
                ledger: ledger,
                auth: auth,
                tokenProgram: TOKEN_PROGRAM_ID,
                rentProgram: web3.SYSVAR_RENT_PUBKEY,
                systemProgram: web3.SystemProgram.programId,
            }
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
