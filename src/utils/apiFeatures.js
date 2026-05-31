class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const searchTerm = this.queryString.q;

    if (searchTerm) {
      this.query = this.query.find({ $text: { $search: searchTerm } });
    }

    return this;
  }

  paginate(defaultLimit = 5) {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || defaultLimit;
    const skip = (page - 1) * limit;

    this.pagination = { page, limit, skip };
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;