import * as bare from "@bare-ts/lib"

const config = /* @__PURE__ */ bare.Config({})

export const Gender = {
    FLUID: "FLUID",
    MALE: "MALE",
    FEMALE: "FEMALE"
}

export function readGender(bc) {
    const offset = bc.offset
    const tag = bare.readU8(bc)
    switch (tag) {
        case 1:
            return Gender.FLUID
        case 0:
            return Gender.MALE
        case 2:
            return Gender.FEMALE
        default: {
            bc.offset = offset
            throw new bare.BareError(offset, "invalid tag")
        }
    }
}

export function writeGender(bc, x) {
    switch (x) {
        case Gender.FLUID:
            bare.writeU8(bc, 1)
            break
        case Gender.MALE:
            bare.writeU8(bc, 0)
            break
        case Gender.FEMALE:
            bare.writeU8(bc, 2)
            break
    }
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
