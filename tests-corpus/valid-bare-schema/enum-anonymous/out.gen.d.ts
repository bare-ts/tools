import * as bare from "@bare-ts/lib"

export interface Person {
    readonly name: string
    readonly gender: "FLUID" | "MALE" | "FEMALE"
}

export function readPerson(bc: bare.ByteCursor): Person

export function writePerson(bc: bare.ByteCursor, x: Person): void

export function encodePerson(x: Person): Uint8Array

export function decodePerson(bytes: Uint8Array): Person
