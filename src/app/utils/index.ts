import * as $ from 'jquery';
import { fromEvent, map } from 'rxjs';

export const listenToScrollEnd = (callback: Function): Function => {
    const $body = $("body");
    const scrollEndCondition = () => $body.scrollTop()! + $body.height()! > $(document).height()! - 100;
    const scrollEndHandler = () => {
        if (scrollEndCondition()) {
            callback();
        }
    }
    $body.on("scroll", scrollEndHandler);
    return scrollEndHandler;
}

export const unSubToScrollEnd = (scrollEndHandler: any) => {
    $("body").off("scroll", scrollEndHandler);
}

export const bodyScrollEndEvent = fromEvent(document.getElementsByTagName('body')[0], 'scroll').pipe(map(() => {
    const $body = $("body");
    const scrollEndCondition = $body.scrollTop()! + $body.height()! > $(document).height()! - 100;
    if(scrollEndCondition) return true;
    else return false;
}))

export function* paginatedListGenerator<T>(data: Array<T>, pageSize: number = 20, initialPageSize?: number): Generator<T[], void, unknown> {
    let currentPage = 1;
    const dataLength = data.length;
    while (currentPage <= pageSize) {
        let sliceStart, sliceEnd;
        if (currentPage === 1 && initialPageSize) {
            sliceStart = dataLength - (initialPageSize * currentPage);
            sliceEnd = sliceStart + initialPageSize;
        } else {
            sliceStart = dataLength - (pageSize * currentPage);
            sliceEnd = sliceStart + pageSize;
        }
        const result = data.slice(sliceStart, sliceEnd).map(x => ({ ...x }));
        //console.log(result.length);
        result.reverse();
        yield result;
        currentPage++;
    }
}

export function arraySlice<T>(array: Array<T>, sliceStart?: number, sliceEnd?: number, reverse = true): Array<T> {
    const result = array.slice(sliceStart, sliceEnd).map(x => ({ ...x }));
    if (reverse) result.reverse();
    return result;
}

/* export function* paginatedListGenerator<T>(data: Array<T>, pageSize: number = 20): Generator<T[], void, unknown> {
    let currentPage = 1;
    const dataLength = data.length;
    const newData: T[] = [];
    while(currentPage <= pageSize) {
        let sliceStart = dataLength - (pageSize * currentPage);
        let sliceEnd = sliceStart + pageSize;
        const result =  data.slice(sliceStart, sliceEnd).map(x => ({...x}));
        result.reverse();
        
        newData.concat(result);
        yield newData;
        
        currentPage++;
    }
} */