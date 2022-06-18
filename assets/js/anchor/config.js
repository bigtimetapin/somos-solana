import {web3} from "@project-serum/anchor";

export const preflightCommitment = "processed";
export const programID = new web3.PublicKey("9o7nBtoVvtYRZqp47wkT99tyzPPMYLoMwX41D87xXA1B");
export const ACCOUNT_SEED_01 = Buffer.from("shortershortersh");
export const ACCOUNT_SEED_02 = Buffer.from("robsonrobsonrobs");
//export const BOSS = new web3.PublicKey("DEuG4JnzvMVxMFPoBVvf2GH38mn3ybunMxtfmVU3ms86")
export const BOSS = new web3.PublicKey("GG8E7PgGrZqu3nD4nMPrvWZGT9SUmkAPS3uubP8KG2zc")

//const localnet = "http://127.0.0.1:8899";
const devnet = web3.clusterApiUrl("devnet");
//const mainnet = web3.clusterApiUrl("mainnet-beta");
export const network = devnet;
