
import { AndFilter, Filter } from '@remult/core';
import { comparableFilterItem, EntityField, EntityWhere, FindOptions, Repository, supportsContains } from "@remult/core";
import { FieldDefinitions } from "@remult/core";
import { getFieldDefinition } from '..';

export class FilterHelper<rowType> {
  filterRow: rowType;
  filterColumns: FieldDefinitions[] = [];
  forceEqual: FieldDefinitions[] = [];
  constructor(private reloadData: () => void, private repository: Repository<rowType>) {

  }
  isFiltered(columnInput: FieldDefinitions | EntityField<any, any>) {

    return this.filterColumns.indexOf(getFieldDefinition(columnInput)) >= 0;
  }
  filterColumn(columnInput: FieldDefinitions | EntityField<any, any>, clearFilter: boolean, forceEqual: boolean) {
    let column = getFieldDefinition(columnInput);
    if (!column)
      return;
    if (clearFilter) {
      this.filterColumns.splice(this.filterColumns.indexOf(column, 1), 1);
      this.forceEqual.splice(this.forceEqual.indexOf(column, 1), 1);
    }
    else if (this.filterColumns.indexOf(column) < 0) {
      this.filterColumns.push(column);
      if (forceEqual)
        this.forceEqual.push(column);
    }
    this.reloadData();
  }
  addToFindOptions(opt: FindOptions<rowType>) {
    this.filterColumns.forEach(c => {

      //@ts-ignore
      let val = this.filterRow[c.key];
      let w: EntityWhere<rowType> = item => {
        let itemForFilter: comparableFilterItem<any> & supportsContains<any> = item[c.key];
        let f: Filter = itemForFilter.isEqualTo(val);
        if (c.dataType == String && !this.forceEqual.find(x => c.key == x.key))
          f = itemForFilter.contains(val);
        else if (c.dataType == Date) {
          if (val) {
            let v = <Date>val;
            v = new Date(v.getFullYear(), v.getMonth(), v.getDate());

            f = itemForFilter.isGreaterOrEqualTo(v).and(itemForFilter.isLessThan((new Date(v.getFullYear(), v.getMonth(), v.getDate() + 1))));
          }
        }
        return f;

      }
     

      if (opt.where) {
        let x = opt.where;
        opt.where = [x, w];
      }
      else opt.where = w;
    });
  }
}