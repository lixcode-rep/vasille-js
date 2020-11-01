// @flow
import {Callable} from "./interfaces/idefinition";
import {IValue}   from "./interfaces/ivalue";

import {BaseNode, Node} from "./node";
import {Value}          from "./value";



/**
 * Defines a node property
 */
export class Property {
    #Type : Function;
    #init : Array<any>;

    /**
     * Construct a property definition
     * @param _type {Function} is the property constructor
     * @param init {args} are arguments to initialize the type
     */
    constructor (
        _type   : Function,
        ...init : Array<any>
    ) {
        this.#Type = _type;
        this.#init = init;
    }

    /**
     * Gets the constructor of property
     * @return {Function}
     */
    get type () : Function {
        return this.#Type;
    }

    /**
     * Create a default value of property
     * @returns {Value} a property value object
     */
    createDefaultValue () : Value {
        return new Value(new this.#Type(...this.#init));
    }
}

/**
 * Constructs a property field value
 * @param rt {BaseNode} is root component
 * @param ts {Node} is this component
 * @param value {?any} is the initial value of field
 * @param func {?Callable} is the function to calc filed value
 * @return {IValue} Given value or new generated
 */
export function propertify (
    rt    : BaseNode,
    ts    : Node,
    value : ?any = null,
    func  : ?Callable = null
) : IValue {
    if (func) {
        let v = func.func(rt, ts);

        if (v instanceof IValue) {
            return v;
        } else {
            return new Value(v);
        }
    } else {
        if (value instanceof IValue) {
            return value;
        } else {
            return new Value(value);
        }
    }
}
