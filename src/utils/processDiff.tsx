import { PluginT } from "../types";

export function processDiff(file: string) {
  if (typeof file !== "string") {
    return [];
  }
  const plugins: PluginT[] = [];

  const content = file.split("\n");
  let plugin: PluginT = {
    file: "",
    oldVersion: "",
    newVersion: "",
    componentId: "",
    status: "",
  };
  let pluginFile: string = "",
    oldVersion: string = "",
    newVersion: string = "",
    componentId: string = "",
    status: string = "";

  let gitError = false;
  // for (let index = 0; index < array.length; index++) {
  //   const element = array[index];

  // }

  content.forEach((line, key) => {
    if (line.startsWith("diff")) {
      if (key !== 0) {
        if (oldVersion === "" && newVersion !== "") {
          status = "new";
        }
        if (oldVersion !== "" && newVersion !== "") {
          status = "updated";
        }
        if (oldVersion !== "" && newVersion === "") {
          status = "removed";
        }

        plugin = {
          file: pluginFile,
          oldVersion,
          newVersion,
          componentId,
          status,
        };
        plugins.push(plugin);
      }
      const files = line.split(" ");
      pluginFile = files[2];
      file = oldVersion = newVersion = componentId = status = "";

      if (files[2].substring(2) !== files[3].substring(2)) {
        status = "removed";
        plugins.push(plugin);
        file = files[3];
        status = "new";
        gitError = true;
      } else {
        gitError = false;
      }
    }
    if (line.includes("-$plugin->version") && !gitError) {
      oldVersion = line
        .substring(line.indexOf("=") + 1, line.lastIndexOf(";"))
        .replace(/\s/g, "");
    }
    if (line.includes("+$plugin->version")) {
      newVersion = line
        .substring(line.indexOf("=") + 1, line.lastIndexOf(";"))
        .replace(/\s/g, "");
    }
    // if (line.replace(/\s/g, "").startsWith("$plugin->component")) {
    if (line.includes("$plugin->component")) {
      componentId = line
        .substring(line.indexOf("=") + 1, line.lastIndexOf(";"))
        .replace(/\s/g, "");
    }
  });

  if (oldVersion === "" && newVersion !== "") {
    status = "new";
  }

  if (oldVersion !== "" && newVersion !== "") {
    status = "updated";
  }

  if (oldVersion !== "" && newVersion === "") {
    status = "removed";
  }

  plugin = {
    file: pluginFile,
    oldVersion,
    newVersion,
    componentId,
    status,
  };

  plugins.push(plugin);

  return plugins;
}
