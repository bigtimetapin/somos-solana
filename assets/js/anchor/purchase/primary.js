import {web3} from "@project-serum/anchor";
import {ACCOUNT_SEED_01, BOSS, programID} from "../config";
import {textEncoder} from "../util";

export async function primary(program, provider, ledger, user) {
    try {
        // get patron pda
        const [patron, _] = await web3.PublicKey.findProgramAddress(
            [textEncoder.encode(ACCOUNT_SEED_01), provider.wallet.publicKey.toBuffer()],
            programID
        );
        // rpc
        await program.rpc.purchasePrimary({
            accounts: {
                buyer: provider.wallet.publicKey,
                buyerAsPatron: patron,
                boss: BOSS,
                ledger: ledger,
                systemProgram: web3.SystemProgram.programId,
            },
        });
        // send state to elm
        app.ports.getCurrentStateListener.send(user);
        // log success
        console.log("primary purchase success");
    } catch (error) {
        // log error
        console.log(error.toString());
        // send error to elm
        app.ports.purchasePrimaryFailureListener.send(error.message)
    }
}

export async function primaryForOther(program, provider, recipient, ledger, user) {
    try {
        await program.rpc.purchasePrimaryForOther({
            accounts: {
                buyer: provider.wallet.publicKey,
                recipient: new web3.PublicKey(recipient),
                boss: BOSS,
                ledger: ledger,
                systemProgram: web3.SystemProgram.programId,
            },
        });
        // send state to elm
        app.ports.getCurrentStateListener.send(user);
        // log success
        console.log("primary purchase success");
    } catch (error) {
        // log error
        console.log(error.toString());
        // send error to elm
        app.ports.purchasePrimaryFailureListener.send(error.message)
    }
}
