import { CONSTANTS } from "../constants/constants";
import { BRTBuilder } from "../core/brt-builder";
import { BetterResults } from "../core/brt-table-results";
import { BRTCONFIG } from "../core/config";
import { LootChatCard } from "./loot-chat-card";
import { LootCreator } from "./loot-creator";

export class BRTLootHelpers {
  /**
   * Roll a table an add the resulting loot to a given token.
   *
   * @param {RollTable} tableEntity
   * @param {TokenDocument} token
   * @param {options} object
   * @returns
   */
  static async addLootToSelectedToken(tableEntity, token = null, options = null) {
    let tokenstack = [];
    const isTokenActor = options && options?.isTokenActor;
    const stackSame = options && options?.stackSame ? options.stackSame : true;
    const customRoll = options && options?.customRole ? options.customRole : undefined;
    const itemLimit = options && options?.itemLimit ? Number(options.itemLimit) : 0;

    if (null == token && canvas.tokens.controlled.length === 0) {
      return ui.notifications.error("Please select a token first");
    } else {
      tokenstack = token ? (token.length >= 0 ? token : [token]) : canvas.tokens.controlled;
    }

    ui.notifications.info(CONSTANTS.MODULE_ID + " | API | Loot generation started.");

    const brtBuilder = new BRTBuilder(tableEntity);

    for (const token of tokenstack) {
      const results = await brtBuilder({
        rollsAmount: customRoll ?? options?.rollsAmount,
        dc: options.dc,
        skill: options.skill,
      });
      const br = new BetterResults(results);
      const betterResults = await br.buildResults(tableEntity);
      const currencyData = br.getCurrencyData();
      const lootCreator = new LootCreator(betterResults, currencyData);

      await lootCreator.addCurrenciesToToken(token, isTokenActor);
      await lootCreator.addItemsToToken(token, stackSame, isTokenActor, itemLimit);
    }

    return ui.notifications.info(CONSTANTS.MODULE_ID + " | API | Loot generation complete.");
  }

  /**
   *
   * @param {*} tableEntity
   */
  static async generateLoot(tableEntity, options = {}) {
    const builder = new BRTBuilder(tableEntity);
    const results = await builder.betterRoll({
      rollsAmount: options?.rollsAmount,
      dc: options?.dc,
      skill: options?.skill,
    });
    const br = new BetterResults(results);
    const betterResults = await br.buildResults(tableEntity);
    const currencyData = br.getCurrencyData();
    const lootCreator = new LootCreator(betterResults, currencyData);

    await lootCreator.createActor(tableEntity);
    await lootCreator.addCurrenciesToActor();
    await lootCreator.addItemsToActor();

    if (game.settings.get(CONSTANTS.MODULE_ID, BRTCONFIG.ALWAYS_SHOW_GENERATED_LOOT_AS_MESSAGE)) {
      let rollMode = options && "rollMode" in options ? options.rollMode : null;
      if (String(getProperty(tableEntity, `flags.${CONSTANTS.MODULE_ID}.${BRTCONFIG.HIDDEN_TABLE}`)) === "true") {
        rollMode = "gmroll";
      }
      const lootChatCard = new LootChatCard(betterResults, currencyData, rollMode);
      await lootChatCard.createChatCard(tableEntity);
    }
  }

  static async generateChatLoot(tableEntity, options = null) {
    let rollMode = options && "rollMode" in options ? options.rollMode : null;
    if (String(getProperty(tableEntity, `flags.${CONSTANTS.MODULE_ID}.${BRTCONFIG.HIDDEN_TABLE}`)) === "true") {
      rollMode = "gmroll";
    }
    const brtBuilder = new BRTBuilder(tableEntity);
    const results = await brtBuilder.betterRoll({
      rollsAmount: options?.rollsAmount,
      dc: options?.dc,
      skill: options?.skill,
    });
    const br = new BetterResults(results);
    const betterResults = await br.buildResults(tableEntity);
    const currencyData = br.getCurrencyData();
    const lootChatCard = new LootChatCard(betterResults, currencyData, rollMode);

    await lootChatCard.createChatCard(tableEntity);
  }

  static async addCurrenciesToActor(actor, lootCurrency) {
    const currencyData = duplicate(actor.system.currency);
    // const lootCurrency = this.currencyData;

    for (const key in lootCurrency) {
      if (Object.getOwnPropertyDescriptor(currencyData, key)) {
        const amount = Number(currencyData[key].value || 0) + Number(lootCurrency[key]);
        currencyData[key] = amount.toString();
      }
    }
    await actor.update({ "system.currency": currencyData });
  }

  /**
   *
   * @param {Token|Actor} token
   * @param {Object} currencyData
   * @param {Boolean} is the token passed as the token actor instead?
   */
  static async addCurrenciesToToken(token, lootCurrency, isTokenActor = false) {
    // needed for base key set in the event that a token has no currency properties
    const currencyDataInitial = { cp: 0, ep: 0, gp: 0, pp: 0, sp: 0 };
    let currencyData = currencyDataInitial;

    if (isTokenActor) {
      currencyData = duplicate(token.system.currency);
    } else if (token.actor.system.currency) {
      currencyData = duplicate(token.actor.system.currency);
    }

    // const lootCurrency = currencyData;

    for (const key in currencyDataInitial) {
      const amount = Number(currencyData[key] || 0) + Number(lootCurrency[key] || 0);
      currencyData[key] = amount;
    }

    if (isTokenActor) {
      // @type {Actor}
      return await token.update({ "system.currency": currencyData });
    } else {
      return await token.actor.update({ "system.currency": currencyData });
    }
  }
}
