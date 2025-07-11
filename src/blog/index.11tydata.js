export default {
  permalink: data => {
    if (data.pagination && data.pagination.pageNumber > 0) {
      return `/blog/page/${data.pagination.pageNumber + 1}/index.html`;
    }
    return "/blog/index.html";
  }
};
