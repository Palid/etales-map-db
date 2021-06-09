// import * as war3map from "war3map";
import { dirname, basename, sep } from "path";

import { TextDecoder } from "util";

const { FS, MPQ } = require("@wowserhq/stormjs");

const files = {
  strings: "war3map.wts",
  jass: "war3map.j",
  items: "war3map.w3t",
};

export async function read(pathToMap: string) {
  const dir = dirname(pathToMap);
  const fileName = basename(pathToMap);
  FS.mkdir("/stormjs");
  FS.mount(FS.filesystems.NODEFS, { root: dir }, `${sep}${fileName}`);
  const results = new Map<string, Uint8Array>();
  // This __should__ work on windows, but need to double check it.
  const mpq = await MPQ.open(`/stormjs/${dirname}/${fileName}`, "r");
  for (const [name, fileName] of Object.entries(files)) {
    const file = mpq.openFile(fileName);
    const data = file.read();
    // Copy the data, as the library returns the same Uint8Array object
    results.set(name, data.slice(0));
    file.close();
  }
  mpq.close();
  FS.unmount("/stormjs");
  FS.rmdir("/stormjs");

  const decoder = new TextDecoder("utf-8");
  const ret = {
    strings: decoder.decode(results.get("strings")),
    jass: decoder.decode(results.get("jass")),
  };
  return ret;
}