import { RepeatNode, RepeatNodePrivate } from "./repeat-node";
import { Reference } from "../value/reference";
import { IValue } from "../core/ivalue";



/**
 * Private part of repeater
 * @class RepeaterPrivate
 * @extends RepeatNodePrivate
 */
export class RepeaterPrivate<IdT> extends RepeatNodePrivate<IdT> {
    /**
     * Handler to catch count updates
     */
    public updateHandler : (value: number) => void;

    /**
     * Current count of child nodes
     */
    public currentCount : number = 0;

    public constructor () {
        super ();
        this.$seal();
    }
}

/**
 * The simplest repeat node interpretation, repeat children pack a several times
 * @class Repeater
 * @extends RepeatNode
 */
export class Repeater extends RepeatNode<number, number> {

    protected $ : RepeaterPrivate<number>;

    /**
     * The count of children
     */
    public count : IValue<number> = new Reference(0);

    public constructor ($ ?: RepeaterPrivate<number>) {
        super($ || new RepeaterPrivate);
        this.$seal();
    }

    /**
     * Changes the children count
     */
    public changeCount (number : number) {
        let $ : RepeaterPrivate<number> = this.$;

        if (number > $.currentCount) {
            for (let i = $.currentCount; i < number; i++) {
                this.createChild(i, i);
            }
        }
        else {
            for (let i = $.currentCount - 1; i >= number; i--) {
                this.destroyChild(i, i);
            }
        }
        $.currentCount = number;
    }

    public $created () {
        let $ : RepeaterPrivate<number> = this.$;

        super.$created();

        $.updateHandler = (value : number) => {
            this.changeCount(value);
        };
        this.count.on($.updateHandler);
    }

    public $ready () {
        this.changeCount(this.count.$);
    }

    public $destroy () {
        let $ : RepeaterPrivate<number> = this.$;

        super.$destroy();
        this.count.off($.updateHandler);
    }
}
