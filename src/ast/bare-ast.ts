import type { Location } from "../core/compiler-error.js"

export interface Ast {
    readonly defs: readonly AliasedType[]
    readonly loc: Location | null
}

export interface AliasedType {
    readonly alias: string
    readonly exported: boolean
    readonly type: Type
    readonly loc: Location | null
}

export type Type =
    | Alias // Named user type
    | ArrayType // []type, [n]type
    | DataType // data, data<length>
    | EnumType
    | LiteralType // map[type]type
    | MapType // map[type]type
    | OptionalType // optional<type>
    | PrimitiveType
    | SetType // []type
    | StructType // { fields... }
    | TypedArrayType
    | UnionType // (type | ...)

export interface Alias {
    readonly tag: "alias"
    readonly props: {
        readonly alias: string
    }
    readonly types: null
    readonly loc: Location | null
}

export interface ArrayType {
    readonly tag: "array"
    readonly props: {
        readonly len: number | null
        readonly mut: boolean
    }
    readonly types: readonly [valType: Type]
    readonly loc: Location | null
}

export interface DataType {
    readonly tag: "data"
    readonly props: {
        readonly len: number | null
        readonly mut: boolean
    }
    readonly types: null
    readonly loc: Location | null
}

export interface EnumType {
    readonly tag: "enum"
    readonly props: {
        readonly intEnum: boolean
        readonly vals: readonly EnumVal[]
    }
    readonly types: null
    readonly loc: Location | null
}

export interface EnumVal {
    readonly name: string
    readonly val: number
    readonly loc: Location | null
}

export interface LiteralType {
    readonly tag: "literal"
    readonly props: {
        readonly val?: Literal
    }
    readonly types: null
    readonly loc: Location | null
}

export type Literal = bigint | boolean | number | null | string | undefined

export interface MapType {
    readonly tag: "map"
    readonly props: {
        readonly mut: boolean
    }
    readonly types: readonly [keyType: Type, valType: Type]
    readonly loc: Location | null
}

export interface OptionalType {
    readonly tag: "optional"
    readonly props: {
        readonly lax: boolean
        readonly undef: boolean
    }
    readonly types: readonly [type: Type]
    readonly loc: Location | null
}

export interface PrimitiveType {
    readonly tag: PrimitiveTag
    readonly props: null
    readonly types: null
    readonly loc: Location | null
}

export interface SetType {
    readonly tag: "set"
    readonly props: {
        readonly len: null
        readonly mut: boolean
    }
    readonly types: readonly [valType: Type]
    readonly loc: Location | null
}

export interface StructType {
    readonly tag: "struct"
    readonly props: {
        readonly class: boolean
        readonly fields: StructField[]
    }
    readonly types: readonly Type[]
    readonly loc: Location | null
}

export interface StructField {
    readonly mut: boolean
    readonly name: string
    readonly loc: Location | null
}

export interface TypedArrayType {
    readonly tag: "typedarray"
    readonly props: {
        readonly len: number | null
        readonly valType: TypedArrayValType
    }
    readonly types: null
    readonly loc: Location | null
}

export interface UnionType<T extends Type = Type> {
    readonly tag: "union"
    readonly props: {
        readonly flat: boolean
        readonly tags: readonly number[]
    }
    readonly types: readonly T[]
    readonly loc: Location | null
}

export type PrimitiveTag = typeof PRIMITIVE_TAG[number]

export function isPrimitiveTag(tag: string): tag is PrimitiveTag {
    return PRIMITIVE_TAG_SET.has(tag)
}

export function isPrimitiveType(type: Type): type is PrimitiveType {
    return isPrimitiveTag(type.tag)
}

export const PRIMITIVE_TAG = [
    "bool",
    "f32",
    "f64",
    "i8",
    "i16",
    "i32",
    "i64Safe",
    "i64",
    "int",
    "intSafe",
    "string",
    "u8",
    "u16",
    "u32",
    "u64",
    "u64Safe",
    "uint",
    "uintSafe",
    "void",
] as const

const PRIMITIVE_TAG_SET: ReadonlySet<string> = new Set(PRIMITIVE_TAG)

export type TypedArrayValType = keyof typeof TYPED_ARRAY_VAL_TYPE_TO_ARRAY

export function isTypedArrayValType(name: string): name is TypedArrayValType {
    return Object.hasOwnProperty.call(TYPED_ARRAY_VAL_TYPE_TO_ARRAY, name)
}

export const TYPED_ARRAY_VAL_TYPE_TO_ARRAY = {
    "i8": "Int8Array",
    "i16": "Int16Array",
    "i32": "Int32Array",
    "i64": "BigInt64Array",
    "u8": "Uint8Array",
    "u8Clamped": "Uint8ClampedArray",
    "u16": "Uint16Array",
    "u32": "Uint32Array",
    "u64": "BigUint64Array",
} as const

export type SymbolTable = ReadonlyMap<string, AliasedType>

export function symbols(schema: Ast): SymbolTable {
    const result = new Map<string, AliasedType>()
    for (const aliased of schema.defs) {
        result.set(aliased.alias, aliased)
    }
    return result
}

export function resolveAlias(type: Type, symbols: SymbolTable): Type {
    if (type.tag === "alias") {
        const aliasedType = symbols.get(type.props.alias)
        if (aliasedType !== undefined) {
            return resolveAlias(aliasedType.type, symbols)
        }
    }
    return type
}

export const PRIMITIVE_TAG_TO_TYPEOF = {
    "bool": "boolean",
    "f32": "number",
    "f64": "number",
    "i8": "number",
    "i16": "number",
    "i32": "number",
    "i64": "bigint",
    "i64Safe": "number",
    "int": "bigint",
    "intSafe": "number",
    "string": "string",
    "u8": "number",
    "u16": "number",
    "u32": "number",
    "u64": "bigint",
    "u64Safe": "number",
    "uint": "bigint",
    "uintSafe": "number",
    "void": null,
} as const

/**
 * @param structs
 * @return if the first field of every struct discriminates these structs in
 *  a union, then the returned value is their discriminators. Otherwise the
 *  result is null.
 */
export function leadingDiscriminators(
    structs: readonly StructType[]
): Literal[] | null {
    if (structs.length > 0) {
        const literals: Set<Literal> = new Set()
        const type0LeadingField = structs[0].props.fields[0]
        for (const struct of structs) {
            const fields = struct.props.fields
            if (
                fields.length === 0 ||
                fields[0].name !== type0LeadingField.name ||
                struct.types[0].tag !== "literal" ||
                literals.has(struct.types[0].props.val)
            ) {
                return null
            }
            literals.add(struct.types[0].props.val)
        }
        return Array.from(literals.values()) // literals in insertion order
    }
    return null
}
