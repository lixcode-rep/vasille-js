import { BaseView, BaseViewPrivate } from "./base-view";
import { MapModel } from "../models/map-model";



/**
 * Create a children pack for each map value
 * @class MapView
 * @extends BaseView
 */
export class MapView<K, T> extends BaseView<K, T, MapModel<K, T>> {

    public constructor (model : MapModel<K, T>) {
        super();
        this.model = model;
    }

    public ready () {
        const map : MapModel<K, T> = this.model;

        map.forEach((value, key) => {
            this.createChild(key, value);
        });

        super.ready();
    }
}

