import * as bare from "@bare-ts/lib"

export type u8 = number

export class Person {
    readonly name: string
    readonly age: u8
    constructor(
        name: string,
        age: u8,
    ) {
        this.name = name
        this.age = age
    }
}

export function readPerson(bc: bare.ByteCursor): Person {
    const name = (bare.readString)(bc)
    const age = (bare.readU8)(bc)
    return new Person(name, age)
}

export function writePerson(bc: bare.ByteCursor, x: Person): void {
    (bare.writeString)(bc, x.name);
    (bare.writeU8)(bc, x.age);
}
