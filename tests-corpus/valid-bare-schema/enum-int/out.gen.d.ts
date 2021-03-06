import * as bare from "@bare-ts/lib"

export declare enum Gender {
    FLUID = 0,
    MALE = 1,
    FEMALE = 2,
}

export function readGender(bc: bare.ByteCursor): Gender

export function writeGender(bc: bare.ByteCursor, x: Gender): void

export function encodeGender(x: Gender): Uint8Array

export function decodeGender(bytes: Uint8Array): Gender
