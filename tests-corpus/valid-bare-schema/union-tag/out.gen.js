import * as bare from "@bare-ts/lib"

export function readUnsignedInt(bc) {
    const offset = bc.offset
    const tag = bare.readU8(bc)
    switch (tag) {
        case 0:
            return { tag, val: (bare.readU8)(bc) }
        case 1:
            return { tag, val: (bare.readU16)(bc) }
        case 2:
            return { tag, val: (bare.readU32)(bc) }
        case 99:
            return { tag, val: (bare.readU64)(bc) }
        default: {
            bc.offset = offset
            throw new bare.BareError(offset, "invalid tag")
        }
    }
}

export function writeUnsignedInt(bc, x) {
    bare.writeU8(bc, x.tag)
    switch (x.tag) {
        case 0:
            (bare.writeU8)(bc, x.val)
            break
        case 1:
            (bare.writeU16)(bc, x.val)
            break
        case 2:
            (bare.writeU32)(bc, x.val)
            break
        case 99:
            (bare.writeU64)(bc, x.val)
            break
    }
}