type QueryStr = {
	keyword: string;
	page: number;
	limit: number;
};

interface ApiFeatureInterface {
	query: any;
	queryStr: QueryStr;
}

export class ApiFeature implements ApiFeatureInterface {
	query: any;
	readonly queryStr: QueryStr;

	constructor(query: any, queryStr: QueryStr) {
		this.query = query;
		this.queryStr = queryStr;
	}

	search() {
		const keyword = !!this.queryStr?.keyword
			? { name: { $regex: this.queryStr.keyword, $options: "i" } }
			: {};
		this.query = this.query.find(keyword);
		return this;
	}

	filter() {
		const copyQueryStr: any = { ...this.queryStr };
		const removeFields: [string, string, string] = ["keyword", "page", "limit"];
		removeFields.forEach((key) => delete copyQueryStr[key]);
		// filter for price and rating
		console.log("check parameters", copyQueryStr);
		this.query = this.query.find(copyQueryStr);
		return this;
	}
}
