api.$inject = ["$http"];

export default api;

function api($http) {
  // const url = "http://localhost:3001/";
  const url = "https://modwatchapi-ansballard.rhcloud.com/";
  return {
    getCurrentVersion() {
      return $http.get(`${url}api/script/version`)
      .then(res => res.data);
    },
    getUserInfo(username) {
      return $http.get(`${url}api/user/${username}/profile`)
      .then(res => res.data);
    },
    uploadMods(req) {
      return $http.post(`${url}loadorder`, req);
    }
  };
}
