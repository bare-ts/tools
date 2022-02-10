import * as bare from "@bare-ts/lib"

export type u8 = number

export interface Operation {
    readonly type: string
    readonly struct: string
    readonly enum: string
    readonly const: boolean
    readonly bc: u8
}

export function readOperation(bc: bare.ByteCursor): Operation

export function writeOperation(bc: bare.ByteCursor, x: Operation): void
