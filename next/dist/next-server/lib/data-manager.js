"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataManager = void 0;
class DataManager {
    constructor(data) {
        this.data = new Map(data);
    }
    getData() {
        return this.data;
    }
    get(key) {
        return this.data.get(key);
    }
    set(key, value) {
        this.data.set(key, value);
    }
    overwrite(data) {
        this.data = new Map(data);
    }
}
exports.DataManager = DataManager;
