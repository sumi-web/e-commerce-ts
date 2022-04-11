import { Query } from 'mongoose';

export interface QueryStr {
  keyword?: string; // only for searching
  page?: number;
  limit?: number;
  category?: string;
}

export class ApiFeature {
  query: Query<any, Document>;
  readonly queryStr: QueryStr;

  constructor(query: any, queryStr: QueryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    // if keyword exists then search for particular keyword inside the database
    const keyword = !!this.queryStr?.keyword
      ? { name: { $regex: this.queryStr.keyword, $options: 'i' } }
      : {};
    this.query = this.query.find(keyword);
    return this;
  }

  filter() {
    const copyQueryStr: QueryStr = { ...this.queryStr };
    const removeFields: string[] = ['keyword', 'page', 'limit'];
    removeFields.forEach((key) => delete copyQueryStr[key as keyof QueryStr]);
    // filter for price and rating
    console.log('check parameters', copyQueryStr);
    let queryStr = JSON.stringify(copyQueryStr);
    // converting all gt or lt as $gt|$lt
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    // filter the query result after search method
    this.query = this.query.find(JSON.parse(queryStr));
    console.log('check the queryStr', queryStr);
    return this;
  }

  pagination(resultPerPage: number) {
    const currentPage: number = Number(this.queryStr?.page) || 1;
    // number of documents that we are going to skip depending on page count
    const skipDocuments: number = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skipDocuments);

    return this;
  }
}
