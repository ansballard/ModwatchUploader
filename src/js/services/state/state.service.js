import { ipcRenderer as ipc } from "electron";

state.$inject = ["$q"];

export default state;

function state($q) {
  const prefix = "modwatch.";
  return {
    isFirstTime() {
      return $q.resolve(!localStorage.getItem(`${prefix}notfirsttime`));
    },
    disableFirstTime() {
      return $q.resolve(localStorage.setItem(`${prefix}notfirsttime`, true));;
    },
    getProgram() {
      return $q.resolve(localStorage.getItem(`${prefix}program`) || "MO");
    },
    getCreds() {
      return $q.resolve({
        username: localStorage.getItem(`${prefix}username`) || undefined,
        password: localStorage.getItem(`${prefix}password`) || undefined
      });
    },
    setCreds(creds) {
      if(creds.username) {
        localStorage.setItem(`${prefix}username`, creds.username);
      }
      if(creds.password) {
        localStorage.setItem(`${prefix}password`, creds.password);
      }
      return $q.resolve();
    },
    getMOPath() {
      return $q.resolve(localStorage.getItem("modwatch.mo_filepath") || undefined);
    },
    getMOFiles(newpath) {
      const d = $q.defer();
      ipc.send("mo.getFiles", newpath);
      ipc.once("mo.files", (event, files = "{}") => {
        files = JSON.parse(files);
        if(files.path) {
          localStorage.setItem(`${prefix}mo_filepath`, files.path);
        }
        d.resolve(files);
      });
      return d.promise;
    },
    getNMMPaths() {
      return $q.all([
        localStorage.getItem(`${prefix}nmm_iniPath`) || undefined,
        localStorage.getItem(`${prefix}nmm_pluginsPath`) || undefined
      ])
      .then(res => ({
        ini: res[0],
        plugins: res[1]
      }));
    },
    getNMMIniFiles(newpath) {
      const d = $q.defer();
      ipc.send("nmm.getIniFiles", newpath);
      ipc.once("nmm.iniFiles", (event, files) => {
        files = JSON.parse(files);
        if(files.path) {
          localStorage.setItem(`${prefix}nmm_iniPath`, files.path);
        }
        d.resolve(files);
      });
      return d.promise;
    },
    getNMMPluginsFile(newpath) {
      const d = $q.defer();
      ipc.send("nmm.getPluginsFile", newpath);
      ipc.once("nmm.pluginsFile", (event, files) => {
        files = JSON.parse(files);
        if(files.path) {
          localStorage.setItem(`${prefix}nmm_pluginsPath`, files.path);
        }
        d.resolve(files);
      });
      return d.promise;
    }
  };
}
