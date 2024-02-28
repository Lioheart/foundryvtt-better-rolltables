import { CONSTANTS } from "../../constants/constants.js";
import { BRTBetterHelpers } from "../../tables/better/brt-helper.js";
import { debug, getSubstring, info, log } from "../../lib/lib.js";
import { CompendiumToRollTableDialog } from "./compendium-to-rollTable-dialog.js";

/**
 * @href https://gist.github.com/crazycalya/0cd20cd12b1a344d21302a794cb229ff
 * @href https://gist.github.com/p4535992/3151778781055a6f68281a0bfd8da1a2
 * @href https://www.reddit.com/r/FoundryVTT/comments/11lbjln/converting_a_compendium_into_a_rollable_table/
 */
export class CompendiumToRollTableSpecialHarvestDialog {
  constructor(allCompendiums, itemTypes) {
    // super(allCompendiums, itemTypes);
    let compendium = allCompendiums[0];

    let msg = {
      name: compendium.metadata.label,
      title: compendium.title ?? compendium.metadata.name,
    };

    info(game.i18n.format(`${CONSTANTS.MODULE_ID}.api.msg.startRolltableGeneration`, msg), true);
    const document = this.fromCompendium(compendium);
    info(game.i18n.format(`${CONSTANTS.MODULE_ID}.api.msg.rolltableGenerationFinished`, msg), true);
    return document;
  }

  /**
   * Group an array of objects by a specified property.
   * @param {Array<T>} array - The array of objects to group.
   * @param {string} property - The property to group the objects by.
   * @returns {Object} An object where the keys are the unique values of the specified property and the values are arrays of objects with that property value.
   * @template T
   *
   * @example
   * const arr = [{type:"A"}, {type:"A"}, {type:"B"}];
   * const result = groupBy(arr, "type");
   * console.log(result); // Output: { A: [{type: "A"}, {type: "A"}], B: [{type: "B"}] }
   */
  _groupBy(arr, property) {
    return arr.reduce(function (memo, x) {
      if (!memo[getProperty(x, property)]) {
        memo[getProperty(x, property)] = [];
      }
      memo[getProperty(x, property)].push(x);
      return memo;
    }, {});
  }

  _convertToSkillDenomination(skillValue) {
    if (!skillValue) {
      return "";
    }
    const skillValueToCheck = String(skillValue).toLowerCase().trim();

    const r = this.skillMap.get(skillValueToCheck);
    return r;
  }

  _containsNumbers(str) {
    return /\d/.test(str);
  }

  /**
   * @override
   * @param {*} customFilters
   * @param {*} nameFilters
   * @param {*} selectedItems
   * @param {*} selectedSpellLevels
   * @param {*} selectedRarities
   * @param {*} weightPredicate
   * @param {*} compendium
   * @param {*} options
   * @returns
   */
  async fromCompendium(compendium, options = {}) {
    // Ported from Foundry's existing RollTable.fromFolder()
    // const results = Promise.all(await compendium.index.map(async (es, i) => {
    const results = await Promise.all(
      // compendium.contents.map(async (es, i) => {
      compendium.index.contents.map(async (es, i) => {
        log("Compendium Item:" + es);
        log("Compendium Index:" + i);
        const e = await fromUuid(es.uuid);
        const dcValue = getProperty(e, `system.description.chat`);
        const skillValue = getProperty(e, `system.description.unidentified`);
        const sourceValue = getProperty(e, `system.source`);

        const skillDenom = this._convertToSkillDenomination(skillValue) ?? skillValue;

        let nameTmp = e.name;
        let has1d = false;
        if (nameTmp.includes("1d")) {
          nameTmp = nameTmp.replace("1d", "");
          has1d = true;
        }
        let num = 1;
        let newName = TextEditor.decodeHTML(e.name);
        if (this._containsNumbers(nameTmp)) {
          let numStr = nameTmp.match(/\d+/)[0]; //nameTmp.replace(/\D/g, "");
          num = has1d ? "1d" + parseInt(numStr) : String(parseInt(numStr));
          if (num <= 0) {
            num = 1;
          }
          let stringToCheck = getSubstring(newName, "(", ")");
          stringToCheck = stringToCheck.replace(/[0-9]/g, "");
          stringToCheck = stringToCheck.replace(" x", "");
          stringToCheck = stringToCheck.replace("x ", "");
          stringToCheck = stringToCheck ?? "";

          let arrNames = newName.replace(numStr, "").split("(");
          if (arrNames.length > 0) {
            newName = arrNames?.length > 0 ? arrNames[0] : nameTmp;
          }
          // newName = newName.replace("(", "");
          // newName = newName.replace(")", "");
          newName = newName.trim() + " " + stringToCheck.trim();
          newName = newName.replace("scales", "scale"); // scales
          newName = newName.replace("Scales", "Scale"); // scales
          newName = newName.replace("plates", "plate"); // plates
          newName = newName.replace("Plates", "Plate"); // plates
          newName = newName.replace("vials", "vial"); // vials
          newName = newName.replace("Vials", "Vial"); // vials
          newName = newName.replace("sacks", "sack"); // sacks
          newName = newName.replace("Sacks", "Sack"); // sacks
          newName = newName.replace("fins", "fin"); //
          newName = newName.replace("Fins", "Fin"); //
          newName = newName.replace("claws", "claw"); //
          newName = newName.replace("Claws", "Claw"); //
          newName = newName.replace(" x", "");
          newName = newName.trim();
        }

        // https://foundryvtt.com/api/v8/data.TableResultData.html
        // _id	string The _id which uniquely identifies this TableResult embedded document
        // type	string	<optional> A result sub-type from CONST.TABLE_RESULT_TYPES (COMPENDIUM: 2, DOCUMENT: 1, TEXT: 0)
        // text	string	<optional> The text which describes the table result
        // img	string	<optional> An image file url that represents the table result
        // collection	string	<optional> A named collection from which this result is drawn
        // resultId	string	<optional> The _id of a Document within the collection this result references
        // weight	number	<optional> The probabilistic weight of this result relative to other results
        // range	Array.<number>	<optional> A length 2 array of ascending integers which defines the range of dice roll totals which produce this drawn result
        // drawn	boolean	<optional> false Has this result already been drawn (without replacement)
        // flags	object	<optional> {} An object of optional key/value flags
        return {
          text: e.name,
          type: CONST.TABLE_RESULT_TYPES.COMPENDIUM,
          collection: compendium.type,
          resultId: e.id ? e.id : e._id,
          img: e.thumbnail || e.img || CONFIG.RollTable.resultIcon,
          weight: 1,
          range: [i + 1, i + 1],
          documentCollection: `${compendium.metadata.packageName}.${compendium.metadata.name}`,
          drawn: false,
          flags: {
            [`${CONSTANTS.MODULE_ID}`]: {
              [`${CONSTANTS.FLAGS.RESULTS_FORMULA_KEY_FORMULA}`]: String(num) ?? "1",
              [`${CONSTANTS.FLAGS.HARVEST_DC_VALUE_KEY}`]: String(dcValue) ?? "0",
              [`${CONSTANTS.FLAGS.HARVEST_SKILL_VALUE_KEY}`]: skillDenom ?? "",
              [`${CONSTANTS.FLAGS.HARVEST_SOURCE_VALUE_KEY}`]: sourceValue ?? "",
              [`${CONSTANTS.FLAGS.GENERIC_RESULT_UUID}`]: es.uuid ?? "",
              [`${CONSTANTS.FLAGS.GENERIC_RESULT_CUSTOM_NAME}`]: newName ?? "",
              [`${CONSTANTS.FLAGS.GENERIC_RESULT_ORIGINAL_NAME}`]: e.name ?? "",
              [`${CONSTANTS.FLAGS.GENERIC_RESULT_ORIGINAL_ICON}`]: e.img ?? "",
            },
          },
        };
      })
    );

    return await this.createCompendiumFromData(compendium.metadata.label, results, `1d${results.length}`, options);
  }

  /**
   * @override
   * @param {*} compendiumName
   * @param {*} results
   * @param {*} formula
   * @param {*} options
   */
  async createCompendiumFromData(compendiumName, results, formula, options = {}) {
    const resultsGroupedBySystemOrigin = this._groupBy(
      results,
      `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.HARVEST_SOURCE_VALUE_KEY}`
    );
    const documents = [];

    for (const [key, values] of Object.entries(resultsGroupedBySystemOrigin)) {
      // For table not make sense in this case
      let firstDcValue = 0;
      let firstSkillDenom =
        values?.length > 0
          ? getProperty(values[0], `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.HARVEST_SKILL_VALUE_KEY}`)
          : "";
      let amount = values.length <= 0 ? values.length + 1 : values.length;
      //options.renderSheet = options.renderSheet ?? true;
      const document = await RollTable.create(
        {
          name: "Better Harvester | " + key + " RollTable",
          description: `Rolltable created from the '${compendiumName}' compendium filter for the system source value '${key}'.`,
          results: values,
          formula: `1d${amount}`,
          flags: {
            [`${CONSTANTS.MODULE_ID}`]: {
              [`${CONSTANTS.FLAGS.TABLE_TYPE_KEY}`]: CONSTANTS.TABLE_TYPE_HARVEST,
              [`${CONSTANTS.FLAGS.HARVEST_DC_VALUE_KEY}`]: String(firstDcValue) ?? "0",
              [`${CONSTANTS.FLAGS.HARVEST_SKILL_VALUE_KEY}`]: firstSkillDenom ?? "",
              [`${CONSTANTS.FLAGS.HARVEST_SOURCE_VALUE_KEY}`]: key ?? "",
              [`${CONSTANTS.FLAGS.GENERIC_DISTINCT_RESULT}`]: true,
              [`${CONSTANTS.FLAGS.GENERIC_DISTINCT_RESULT_KEEP_ROLLING}`]: false,
              [`${CONSTANTS.FLAGS.GENERIC_AMOUNT_KEY}`]: amount ?? 1,
            },
          },
          img: "icons/svg/pawprint.svg",
        },
        options
      );
      await document.normalize();
      documents.push(document);
    }
    return documents;
  }

  skillMap = new Map([
    ["acrobatics", "acr"],
    ["animal handling", "ani"],
    ["arcana", "arc"],
    ["athletics", "ath"],
    ["deception", "dec"],
    ["history", "his"],
    ["insight", "ins"],
    ["investigation", "inv"],
    ["intimidation", "itm"],
    ["medicine", "med"],
    ["nature", "nat"],
    ["persuasion", "per"],
    ["perception", "prc"],
    ["performance", "prf"],
    ["religion", "rel"],
    ["sleight of Hand", "slt"],
    ["stealth", "ste"],
    ["survival", "sur"],
  ]);
}
