import {web3} from "@project-serum/anchor";

export const preflightCommitment = "processed";
export const programID = new web3.PublicKey("2a7WuBMkMtZtZWYLir2FzToT1WqvE2NPZR5GseaBYc4f");
export const AUTH_SEED = Buffer.from("authauthauthautz");
export const ACCOUNT_SEED_01 = Buffer.from("shortershortersz");
export const ACCOUNT_SEED_02 = Buffer.from("robsonrobsonrobs");
export const BOSS = new web3.PublicKey("3XEuQQzBCZam4EfhLjF6sACBovq6VxR4PgB8ekk1enNQ")

//const localnet = "http://127.0.0.1:8899";
const devnet = web3.clusterApiUrl("devnet");
//const mainnet = web3.clusterApiUrl("mainnet-beta");
export const network = devnet;
