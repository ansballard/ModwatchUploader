import FilesService from "./filesService";

(() => {
  "use strict";

  angular.module("modwatchuploader.files", [])
    .factory("FilesService", FilesService);

})();
