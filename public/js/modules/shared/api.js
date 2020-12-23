﻿export default class Api {
    constructor() {
    }
    gridFilterTypes = {
        equal: 'eq',
        not_equal: 'ne',
        less: 'lt',
        less_or_equal: 'le',
        greater: 'gt',
        greater_or_equal: 'ge',
        begins_with: 'bw',
        does_not_begin_with: 'bn',
        is_in: 'in',
        is_not_in: 'ni',
        ends_with: 'ew',
        does_not_end_with: 'en',
        contains: 'cn',
        does_not_contain: 'nc'
    };
    getResources(url) {
        return $._getResources(url);
    }
    getElementByCody($containerEl, codeName) {
        return $containerEl._findByCode(codeName);
    }
}