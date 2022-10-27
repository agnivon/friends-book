import * as $ from 'jquery';

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

export function* paginatedListGenerator<T>(data: Array<T>, pageSize: number = 20): Generator<T[], void, unknown> {
    let currentPage = 1;
    const dataLength = data.length;
    while(currentPage <= pageSize) {
        let sliceStart = dataLength - (pageSize * currentPage);
        let sliceEnd = sliceStart + pageSize;
        const result =  data.slice(sliceStart, sliceEnd).map(x => ({...x}));
        result.reverse();
        yield result;
        currentPage++;
    }
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