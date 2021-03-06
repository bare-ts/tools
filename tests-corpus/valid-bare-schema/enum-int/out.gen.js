import * as bare from "@bare-ts/lib"

const config = /* @__PURE__ */ bare.Config({})

export const Gender = {
    FLUID: 0,
    0: "FLUID",
    MALE: 1,
    1: "MALE",
    FEMALE: 2,
    2: "FEMALE"
}

export function readGender(bc) {
    const offset = bc.offset
    const tag = bare.readU8(bc)
    if (tag > 2) {
        bc.offset = offset
        throw new bare.BareError(offset, "invalid tag")
    }
    return tag
}

export function writeGender(bc, x) {
    bare.writeU8(bc, x)
}

export function encodeGender(x) {
    const bc = new bare.ByteCursor(
        new Uint8Array(config.initialBufferLength),
        config
    )
    writeGender(bc, x)
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset)
}

export function decodeGender(bytes) {
    const bc = new bare.ByteCursor(bytes, config)
    const result = readGender(bc)
    if (bc.offset < bc.view.byteLength) {
        throw new bare.BareError(bc.offset, "remaining bytes")
    }
    return result
}
