import { CONSTANTS } from "./constants/constants";

// ================================
// Logger utility
// ================================

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, ...args) {
  try {
    if (
      game.settings.get(CONSTANTS.MODULE_ID, "debug") ||
      game.modules.get("_dev-mode")?.api?.getPackageDebugValue(CONSTANTS.MODULE_ID, "boolean")
    ) {
      console.log(`DEBUG | ${CONSTANTS.MODULE_ID} | ${msg}`, ...args);
    }
  } catch (e) {
    console.error(e.message);
  }
  return msg;
}

export function log(message, ...args) {
  try {
    message = `${CONSTANTS.MODULE_ID} | ${message}`;
    console.log(message.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return message;
}

export function notify(message, ...args) {
  try {
    message = `${CONSTANTS.MODULE_ID} | ${message}`;
    ui.notifications?.notify(message);
    console.log(message.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return message;
}

export function info(info, notify = false, ...args) {
  try {
    info = `${CONSTANTS.MODULE_ID} | ${info}`;
    if (notify) {
      ui.notifications?.info(info);
    }
    console.log(info.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return info;
}

export function warn(warning, notify = false, ...args) {
  try {
    warning = `${CONSTANTS.MODULE_ID} | ${warning}`;
    if (notify) {
      ui.notifications?.warn(warning);
    }
    console.warn(warning.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return warning;
}

export function error(error, notify = true, ...args) {
  try {
    error = `${CONSTANTS.MODULE_ID} | ${error}`;
    if (notify) {
      ui.notifications?.error(error);
    }
    console.error(error.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return new Error(error.replace("<br>", "\n"));
}

export function timelog(message) {
  warn(Date.now(), message);
}

export const i18n = (key) => {
  return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key, data = {}) => {
  return game.i18n.format(key, data)?.trim();
};

// export const setDebugLevel = (debugText): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
  return `<p class="${CONSTANTS.MODULE_ID}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_ID}</strong>
        <br><br>${message}
    </p>`;
}

// =========================================================================================

export function isEmptyObject(obj) {
  // because Object.keys(new Date()).length === 0;
  // we have to do some additional check
  if (obj === null || obj === undefined) {
    return true;
  }
  if (isRealNumber(obj)) {
    return false;
  }
  if (obj instanceof Object && Object.keys(obj).length === 0) {
    return true;
  }
  if (obj instanceof Array && obj.length === 0) {
    return true;
  }
  if (obj && Object.keys(obj).length === 0) {
    return true;
  }
  return false;
}

export function isRealNumber(inNumber) {
  return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
}

export function isRealBoolean(inBoolean) {
  return String(inBoolean) === "true" || String(inBoolean) === "false";
}

export function isRealBooleanOrElseNull(inBoolean) {
  return isRealBoolean(inBoolean) ? inBoolean : null;
}

export function getSubstring(string, char1, char2) {
  return string.slice(string.indexOf(char1) + 1, string.lastIndexOf(char2));
}

// ================================
// Retrieve document utility
// ================================

export function getDocument(target) {
  if (stringIsUuid(target)) {
    target = fromUuidSync(target);
  }
  return target?.document ?? target;
}

export function stringIsUuid(inId) {
  return typeof inId === "string" && (inId.match(/\./g) || []).length && !inId.endsWith(".");
}

export function getUuid(target) {
  if (stringIsUuid(target)) {
    return target;
  }
  const document = getDocument(target);
  return document?.uuid ?? false;
}

export function getCompendiumCollectionSync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`CompendiumCollection is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof CompendiumCollection) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof CompendiumCollection) {
    return targetTmp;
  }
  // if (stringIsUuid(targetTmp)) {
  //   target = fromUuid(targetTmp);
  // } else {
  targetTmp = game.packs.get(targetTmp);
  if (!targetTmp && !ignoreName) {
    targetTmp = game.packs.getName(targetTmp);
  }
  // }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`CompendiumCollection is not found`, false, targetTmp);
      return;
    } else {
      throw error(`CompendiumCollection is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof CompendiumCollection)) {
    if (ignoreError) {
      warn(`Invalid CompendiumCollection`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid CompendiumCollection`, true, targetTmp);
    }
  }
  return targetTmp;
}

export async function getCompendiumCollectionAsync(target, ignoreError = false, ignoreName = true) {
  let targetTmp = target;
  if (!targetTmp) {
    throw error(`CompendiumCollection is undefined`, true, targetTmp);
  }
  if (targetTmp instanceof CompendiumCollection) {
    return targetTmp;
  }
  // This is just a patch for compatibility with others modules
  if (targetTmp.document) {
    targetTmp = targetTmp.document;
  }
  if (targetTmp.uuid) {
    targetTmp = targetTmp.uuid;
  }

  if (targetTmp instanceof CompendiumCollection) {
    return targetTmp;
  }
  // if (stringIsUuid(targetTmp)) {
  //   target = await fromUuid(targetTmp);
  // } else {
  targetTmp = game.packs.get(targetTmp);
  if (!targetTmp && !ignoreName) {
    targetTmp = game.packs.getName(targetTmp);
  }
  // }
  if (!targetTmp) {
    if (ignoreError) {
      warn(`CompendiumCollection is not found`, false, targetTmp);
      return;
    } else {
      throw error(`CompendiumCollection is not found`, true, targetTmp);
    }
  }
  // Type checking
  if (!(targetTmp instanceof CompendiumCollection)) {
    if (ignoreError) {
      warn(`Invalid CompendiumCollection`, true, targetTmp);
      return;
    } else {
      throw error(`Invalid CompendiumCollection`, true, targetTmp);
    }
  }
  return targetTmp;
}
