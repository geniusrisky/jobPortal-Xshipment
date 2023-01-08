class HttpResponse {
    query;
    result;
    error;
    totalResults;
    pageNo;
    message;
  
    constructor(
      query,
      result,
      message,
      error,
      totalResult,
      pageNo
    ) {
      this.query = query;
      this.result = result;
      this.error = error;
      this.totalResults = totalResult;
      this.pageNo = pageNo;
      this.message = message;
    }
}
  
export default HttpResponse;
  