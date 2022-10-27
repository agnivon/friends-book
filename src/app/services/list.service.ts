import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

interface SliceParameters {
  slicePointer: number
  sliceSize: number
}

type SortComparatorType = ((a: any, b: any) => number) | undefined;

type Entities = Array<any> | null | undefined;

type ForEachCallbackType = ((value: any, index: number, array: any[]) => void) | undefined;

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private auth: AuthService) { }

  performSliceOperations(entities: Entities, slParams: SliceParameters, sortComparator: SortComparatorType, forEachCallback: ForEachCallbackType) {
    if (entities) {
      const { slicePointer, sliceSize } = slParams;
      const sliceStart = entities.length - slicePointer;
      const sliceEnd = sliceStart + sliceSize;
      const entitySlice = entities.slice(sliceStart, sliceEnd);
      if(sortComparator) {
        entitySlice.sort(sortComparator);
      }
      if(forEachCallback) {
        entities.forEach(forEachCallback)
      }
      return entities;
    } else {
      return null;
    }
  }
}
