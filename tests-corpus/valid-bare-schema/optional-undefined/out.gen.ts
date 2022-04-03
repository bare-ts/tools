import * as bare from "@bare-ts/lib"

export type MaybeBool = boolean | undefined

export function readMaybeBool(bc: bare.ByteCursor): MaybeBool {
    return bare.readBool(bc)
        ? bare.readBool(bc)
        : undefined
}

export function writeMaybeBool(bc: bare.ByteCursor, x: MaybeBool): void {
    bare.writeBool(bc, x !== undefined)
    if (x !== undefined) {
        bare.writeBool(bc, x)
    }
}
