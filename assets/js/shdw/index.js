import {web3} from "@project-serum/anchor";
import {ShdwDrive} from "@shadow-drive/sdk";
import {version} from "./config";
import {network} from "../anchor/config";

export async function apply(wallet) {
    // build drive client
    console.log("build client with finalized commitment");
    // build connection with finalized commitment for initial account creation
    const connection = new web3.Connection(network, "finalized");
    const drive = await new ShdwDrive(connection, wallet).init();
    console.log(drive);
    // create storage account
    console.log("create storage account");
    const createStorageResponse = await drive.createStorageAccount("somos", "1KB", version);
    console.log(createStorageResponse);
    console.log(createStorageResponse.shdw_bucket);
    console.log("init account public-key")
    const account = new web3.PublicKey(createStorageResponse.shdw_bucket);
    console.log(account);
    // upload file
    console.log("building file")
    const file = new File(['hello', ' ', 'world'], 'hello_world.txt', {type: 'text/plain'});
    console.log(file);
    console.log("upload file");
    const uploadResponse = await drive.uploadFile(account, file, version);
    console.log(uploadResponse);
    // mark account as immutable
    console.log("mark as immutable");
    await drive.makeStorageImmutable(account, version);
    // upload file
    const file2 = new File(['edit', 'world'], 'hello_world.txt', {type: 'text/plain'});
    // edit file
    const editResponse =  await drive.editFile(account, uploadResponse.finalized_locations[0], file2, version);
    console.log(editResponse);
}
