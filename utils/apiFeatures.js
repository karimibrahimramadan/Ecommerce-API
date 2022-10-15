class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryStrObj = { ...this.queryStr };
    const excludedFields = ["sort", "page", "keyword", "limit"];
    excludedFields.forEach((element) => {
      delete queryStrObj[element];
    });
    let queryStr = JSON.stringify(queryStrObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    this.query = this.queryStr.sort
      ? this.query.sort(this.queryStr.sort.split(",").join(" "))
      : this.query.sort("-createdBy");
    return this;
  }

  limitFields() {
    this.query = this.queryStr.limit
      ? this.query.select(this.queryStr.limit.split(",").join(" "))
      : this.query.select("-__v");
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = (currentPage - 1) * resultPerPage;
    this.query = this.query.skip(skip).limit(resultPerPage);
    return this;
  }
}

module.exports = APIFeatures;
