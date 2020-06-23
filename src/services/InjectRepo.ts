import {getRepository} from "typeorm";

export const InjectRepo = (entity: Function) => (target: any, key: string) => {
    const sKey = Symbol(key);
    Object.defineProperty(target, key, {
        get: function () {
            if (!target[sKey]) target[sKey] = getRepository(entity);
            return target[sKey];
        }
    });
}
