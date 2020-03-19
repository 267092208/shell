/**
 * @module 图层字段配置
 */
import xyyz from "./field/xyyzFields";
import nti from "./field/ntiFields";
import ma from "./field/maFields";
import xzqh from "./field/xzqhFields";
import sq from "./field/sqFields";
import poi from "./field/poiFields";
import poigroups from "./field/poigroupsFields";
import corridor from "./field/corridorFields";
import roadnetwork from "./field/roadnetworkFields";
import lsd from "./field/lsdFields";
import scyk from "./field/scykFields";
import lpglng from "./field/lpglngFields";
import xl from "./field/xlFields";
import target from "./field/targetFields";

const fields = {
  xyyz,
  nti,
  ma,
  xzqh,
  sq,
  poi,
  poigroups,
  corridor,
  roadnetwork,
  lsd,
  scyk,
  lpglng,
  xl,
  target
};

fields["shellyz"] = fields["gsyz"] = fields["xyyz"];
fields["gsnti"] = fields["nti"];
///TODO:目标站字段配置未完成

// console.log("fields['target']",fields);

/**
 * 属性
 */
export const propertys = {};
/**
 * 日期字段
 */
export const dateFields = {};

for (let p in fields) {
  const fs = fields[p];
  //简单图层
  if (Array.isArray(fs)) {
    for (let f of fs) {
      if (f.get || f.set) {
        propertys[p] = propertys[p] || {};

        propertys[p][f.fieldName] = {
          get: f.get,
          set: f.set,
          enumerable: true
        };
      }
      if (f.type == "date" || f.type == "time") {
        dateFields[p] = dateFields[p] || {};
        dateFields[p][f.fieldName] = f.type;
      }
    }
  } else {
    //复合图层
    for (let i in fs) {
      for (let f of fs[i]) {

        if (f.get || f.set) {
          propertys[p] = propertys[p] || {};

          propertys[p][i] = propertys[p][i] || {};
          propertys[p][i][f.fieldName] = {
            get: f.get,
            set: f.set,
            enumerable: true
          };
        }

        if (f.type == "date" || f.type == "time") {
          dateFields[p] = dateFields[p] || {};

          dateFields[p][i] = dateFields[p][i] || {};
          dateFields[p][i][f.fieldName] = f.type;
        }
      }
    }

  }
}

export default fields;
