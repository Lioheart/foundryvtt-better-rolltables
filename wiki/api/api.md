# API DOCUMENTATION

The api is reachable from the variable `game.modules.get('better-rolltables').api` or from the socket libary `socketLib` on the variable `game.modules.get('better-rolltables').socket` if present and active.

### The documentation can be out of sync with the API code checkout the code if you want to dig up [API](../../src/scripts/API.js)

You can find some javascript examples here **=> [macros](./macros/) <=**

### NOTE: The refrence to the old api, it will remain for retrocompatibility, `game.betterTables` and `game.modules.get("better-rolltables").public.API`, but all the api references are moved from ` game.betterTables` and `game.modules.get("better-rolltables").public.API` to `game.modules.get("better-rolltables").api`, so please use  `game.modules.get("better-rolltables").api` for get api from this module.

### The documentation can be out of sync with the API code checkout the code if you want to dig up [API](../../src/scripts/API.js)

The api is reachable from the variable `game.modules.get('better-rolltables').api` or from the socket libary `socketLib` on the variable `game.modules.get('better-rolltables').socket` if present and active.

### Roll a table (OLD METHOD)

`game.modules.get("better-rolltables").api.rollOld(tableEntity)` ⇒ `Promise<{flavor: *, sound: string, user: *, content: *}>`

Roll a table as a Better table in chat

**Returns**: `Promise<object<{flavor: *, sound: string, user: *, content: *}>>` - Details of the chatcard message created

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| tableEntity              | `RollTable`             |         | tableEntity rolltable to generate content from         |

**Example**:

```js
const tableEntity  = game.tables.getName("Loot Table");
game.modules.get('better-rolltables').api.rollOld(tableEntity)

```

### Roll a table with options (Just for Item Piles Retrocompatibility https://github.com/fantasycalendar/FoundryVTT-ItemPiles/blob/f4aa02d179c8fee8ba74322db6f4989b23949ff8/src/helpers/pile-utilities.js#L1602)

`game.modules.get("better-rolltables").api.roll(tableEntity,options)` ⇒ `Promise<object<{itemsData: TableResult[]}>>`

Roll a table as a Better table with options and get

**Returns**: `Promise<object<{itemsData: TableResult[]}>>` - Details of the chatcard message created

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| tableEntity              | `RollTable`             |         | tableEntity rolltable to generate content from         |
| options                  | `object`                |         | OPTIONAL: Options to pass to the function                        |
| [options.roll]           | `Roll or string`        |  null   | An optional pre-configured Roll instance which defines the dice roll to use |
| [options.recursive]      | `boolean`               |  true   | Allow drawing recursively from inner RollTable results |
| [options.displayChat]    | `boolean`               |  true   | Whether to automatically display the results in chat |
| [options.rollMode]       | `string`                |  null   | Type of rollMode for the chat card: 'blindroll'|'gmroll'|'selfroll' |
| [options.rollsAmount]    | `string or number`      |   1     | The rolls amount value  |
| [options.dc]             | `string or number`      |  null   | The dc value (only for Harvest type rolltable) |
| [options.skill]          | `string`                |  null   | The skill denomination (only for Harvest type rolltable). If there is a "," in the skill string. , it will be treated as an array of skills for example "nat,arc" implies that the roll result will be compared as both a nat (nat) and arcane (arc) roll |
| [options.distinct]       | `boolean`               |  false  | if checked the same result is not selected more than once indifferently from the number of 'Amount Roll' |
| [options.distinctKeepRolling]  | `boolean`         |  false  | if 'Distinct result' is checked and 'Amount Rolls' > of the numbers of the result, keep rolling as a normal 'Roll +' behavior |
| [options.usePercentage]    | `boolean`             |  false   | Use the % mechanism instead of the default formula+range behavior |
| [options.stackResultsWithBRTLogic] | `boolean`     |  false   |  if enabled the table results are stacked with the BRT logic like the module item-piles a new 'quantity' property is been added to the table result data to check how much the single result is been stacked |

**Example**:

```js
const tableEntity  = game.tables.getName("Loot Table");
game.modules.get('better-rolltables').api.roll(tableEntity, { rollMode: 'blindroll'});


let tableHarvester = game.tables.get("KyItttMdWxH4hGNf");
game.modules.get("better-rolltables").api.roll(tableHarvester, {
   rollMode: "gmroll",
   dc: 10,
   skill: "med"
});
```

---

---


### Roll a table with options

`game.modules.get("better-rolltables").api.betterTableRoll(tableEntity,options)` ⇒ `Promise<{flavor: *, sound: string, user: *, content: *}>`

Roll a table as a Better table in chat with options

**Returns**: `Promise<object<{flavor: *, sound: string, user: *, content: *}>>` - Details of the chatcard message created

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| tableEntity              | `RollTable`             |         | tableEntity rolltable to generate content from         |
| options                  | `object`                |         | OPTIONAL: Options to pass to the function                        |
| [options.roll]           | `Roll or string`        |  null   | An optional pre-configured Roll instance which defines the dice roll to use |
| [options.recursive]      | `boolean`               |  true   | Allow drawing recursively from inner RollTable results |
| [options.displayChat]    | `boolean`               |  true   | Whether to automatically display the results in chat |
| [options.rollMode]       | `string`                |  null   | Type of rollMode for the chat card: 'blindroll'|'gmroll'|'selfroll' |
| [options.rollsAmount]    | `string or number`      |   1     | The rolls amount value  |
| [options.dc]             | `string or number`      |  null   | The dc value (only for Harvest type rolltable) |
| [options.skill]          | `string`                |  null   | The skill denomination (only for Harvest type rolltable). If there is a "," in the skill string. , it will be treated as an array of skills for example "nat,arc" implies that the roll result will be compared as both a nat (nat) and arcane (arc) roll |
| [options.distinct]       | `boolean`               |  false  | if checked the same result is not selected more than once indifferently from the number of 'Amount Roll' |
| [options.distinctKeepRolling]  | `boolean`         |  false  | if 'Distinct result' is checked and 'Amount Rolls' > of the numbers of the result, keep rolling as a normal 'Roll +' behavior |
| [options.usePercentage]    | `boolean`             |  false   | Use the % mechanism instead of the default formula+range behavior |
| [options.stackResultsWithBRTLogic] | `boolean`     |  false   |  if enabled the table results are stacked with the BRT logic like the module item-piles a new 'quantity' property is been added to the table result data to check how much the single result is been stacked |

**Example**:

```js
const tableEntity  = game.tables.getName("Loot Table");
game.modules.get('better-rolltables').api.betterTableRoll(tableEntity, { rollMode: 'blindroll'});


let tableHarvester = game.tables.get("KyItttMdWxH4hGNf");
game.modules.get("better-rolltables").api.betterTableRoll(tableHarvester, {
   rollMode: "gmroll",
   dc: 10,
   skill: "med"
});
```

---

### Generate Chat Story

`game.modules.get("better-rolltables").api.generateChatStory(tableEntity,options)` ⇒ `Promise<void>`

Generate a story

**Returns**: `Promise<void>` - Details of the chatcard message created

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| tableEntity              | `RollTable`             |         | tableEntity rolltable to generate content from         |

**Example**:

```js
const tableEntity  = game.tables.getName("Loot Table");
game.modules.get('better-rolltables').api.generateChatStory(tableEntity);

```

---


### Create a Table from a compendium

`game.modules.get("better-rolltables").api.createTableFromCompendium(compendiumName, tableName, { weightPredicate })` ⇒ `Promise<Document>`

Create a new RollTable by extracting entries from a compendium.

**Returns**: `Promise<Document>` - Details of the chatcard message created

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| compendiumName           | `string`                |         | the name of the compendium to use for the table generation  |
|  tableName               | `string`                |         | OPTIONAL: the name of the table entity that will be created |
|  weightPredicate         | `function(Document)`    |         | OPTIONAL: a function that returns a weight (number) that will be used for the tableResult weight for that given entity. returning 0 will exclude the entity from appearing in the table |

**Example**:

Using `createTableFromCompendium()` and omitting the optional weightPredicate in a macro or a module.
The following example will take the content of the compendium **dnd5e.items** and create a new rollable table named **My table name**.

```js
game.modules.get("better-rolltables").api.createTableFromCompendium("My table name", "dnd5e.items");
```

You can also filter the entries taken from the the referenced compendium or customize
the weights of each tableResult providing an optional predicate argument when calling `createTableFromCompendium()`.

The optional argument is expected to be an object like this `{weightPredicate: fooFunction}`.

`fooFunction` will be called on every entry/tableResult during table generation.
Entries/tableResults with a weight of `0` will be removed.

#### Filtering the entries

```js
game.modules.get("better-rolltables").api.createTableFromCompendium(
 "001 TABLE",
 "dnd5e.items",
 { weightPredicate: predicate }
);

/*
* this function **has to return the weight** as an integer to use in the table. (0 will not include the item)
*/
function predicate(entity) {
    if(entity.type != "consumable") return 0;
    if(entity.data.data.consumableType != "potion") return 0;
    return 1;
}
```
The above predicate function will only select potions from the dnd5e.items compendium.

#### Adding weight

When not (just) using the predicate function to filter unwanted entries it can be used to
to change the weights.

```js
game.modules.get("better-rolltables").api.createTableFromCompendium("RarityWeightedTable",
    "dnd5e.items",
    { weightPredicate: rarityFilter }
);

function rarityFilter(entity) {
    if(entity.type != "loot") return 0;

    switch (entity.data.data.rarity) {
        case "common":
            return 16;
        case "uncommon":
            return 8;
        case "rare":
            return 4;
        case "veryRare":
            return 2;
        case "legendary":
            return 1;
        default:
            return 0;
    }
}
```



---

### Generate Loot

`game.modules.get("better-rolltables").api.generateLoot(tableEntity,options)` ⇒ `Promise<{flavor: *, sound: string, user: *, content: *}>`

Generate a loot

**Returns**: `Promise<object<{flavor: *, sound: string, user: *, content: *}>>` - Details of the chatcard message created

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| tableEntity              | `RollTable`             |         | tableEntity rolltable to generate content from         |
| options                  | `object`                |         | OPTIONAL: Options to pass to the function                        |
| [options.roll]           | `Roll or string`        |  null   | An optional pre-configured Roll instance which defines the dice roll to use |
| [options.recursive]      | `boolean`               |  true   | Allow drawing recursively from inner RollTable results |
| [options.displayChat]    | `boolean`               |  true   | Whether to automatically display the results in chat |
| [options.rollMode]       | `string`                |  null   | Type of rollMode for the chat card: 'blindroll'|'gmroll'|'selfroll' |
| [options.rollsAmount]    | `string or number`      |   1     | The rolls amount value  |
| [options.dc]             | `string or number`      |  null   | The dc value (only for Harvest type rolltable) |
| [options.skill]          | `string`                |  null   | The skill denomination (only for Harvest type rolltable). If there is a "," in the skill string. , it will be treated as an array of skills for example "nat,arc" implies that the roll result will be compared as both a nat (nat) and arcane (arc) roll |
| [options.distinct]       | `boolean`               |  false  | if checked the same result is not selected more than once indifferently from the number of 'Amount Roll' |
| [options.distinctKeepRolling]  | `boolean`         |  false  | if 'Distinct result' is checked and 'Amount Rolls' > of the numbers of the result, keep rolling as a normal 'Roll +' behavior |
| [options.usePercentage]    | `boolean`             |  false   | Use the % mechanism instead of the default formula+range behavior |
| [options.stackResultsWithBRTLogic] | `boolean`     |  false   |  if enabled the table results are stacked with the BRT logic like the module item-piles a new 'quantity' property is been added to the table result data to check how much the single result is been stacked |

**Example**:

```js
const tableEntity  = game.tables.getName("Loot Table");
game.modules.get('better-rolltables').api.generateLoot(tableEntity, options: { rollMode: 'blindroll'});

```

---


### Generate Chat Loot

`game.modules.get("better-rolltables").api.generateChatLoot(tableEntity,options)` ⇒ `Promise<{flavor: *, sound: string, user: *, content: *}>`

Generate a chat loot

**Returns**: `Promise<object<{flavor: *, sound: string, user: *, content: *}>>` - Details of the chatcard message created

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| tableEntity              | `RollTable`             |         | tableEntity rolltable to generate content from         |
| options                  | `object`                |         | OPTIONAL: Options to pass to the function                        |
| [options.roll]           | `Roll or string`        |  null   | An optional pre-configured Roll instance which defines the dice roll to use |
| [options.recursive]      | `boolean`               |  true   | Allow drawing recursively from inner RollTable results |
| [options.displayChat]    | `boolean`               |  true   | Whether to automatically display the results in chat |
| [options.rollMode]       | `string`                |  null   | Type of rollMode for the chat card: 'blindroll'|'gmroll'|'selfroll' |
| [options.rollsAmount]    | `string or number`      |   1     | The rolls amount value  |
| [options.dc]             | `string or number`      |  null   | The dc value (only for Harvest type rolltable) |
| [options.skill]          | `string`                |  null   | The skill denomination (only for Harvest type rolltable). If there is a "," in the skill string. , it will be treated as an array of skills for example "nat,arc" implies that the roll result will be compared as both a nat (nat) and arcane (arc) roll |
| [options.distinct]       | `boolean`               |  false  | if checked the same result is not selected more than once indifferently from the number of 'Amount Roll' |
| [options.distinctKeepRolling]  | `boolean`         |  false  | if 'Distinct result' is checked and 'Amount Rolls' > of the numbers of the result, keep rolling as a normal 'Roll +' behavior |
| [options.usePercentage]    | `boolean`             |  false   | Use the % mechanism instead of the default formula+range behavior |
| [options.stackResultsWithBRTLogic] | `boolean`     |  false   |  if enabled the table results are stacked with the BRT logic like the module item-piles a new 'quantity' property is been added to the table result data to check how much the single result is been stacked |

**Example**:

```js
const tableEntity  = game.tables.getName("Loot Table");
game.modules.get('better-rolltables').api.generateChatLoot(tableEntity, options: { rollMode: 'blindroll'});

```

---

### Add Loot to selected token

`game.modules.get("better-rolltables").api.addLootToSelectedToken(tableEntity, token, options)` ⇒ `Promise<void>`

Add loot to selcted token ( or the one passed as a argument)

**Returns**: `Promise<void>` - Details of the chatcard message created

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| tableEntity              | `RollTable`             |         | tableEntity rolltable to generate content from         |
| token                    | `TokenDocument`         |         | OPTIONAL: is either a token or an array of tokens (like `canvas.tokens.controlled`).  |
| options                  | `object`                |         | OPTIONAL: Options to pass to the function              |
| [options.roll]           | `Roll or string`        |  null   | An optional pre-configured Roll instance which defines the dice roll to use |
| [options.recursive]      | `boolean`               |  true   | Allow drawing recursively from inner RollTable results |
| [options.displayChat]    | `boolean`               |  true   | Whether to automatically display the results in chat |
| [options.rollMode]       | `string`                |  null   | Type of rollMode for the chat card: 'blindroll'|'gmroll'|'selfroll' |
| [options.rollsAmount]    | `string or number`      |   1     | The rolls amount value  |
| [options.dc]             | `string or number`      |  null   | The dc value (only for Harvest type rolltable) |
| [options.skill]          | `string`                |  null   | The skill denomination (only for Harvest type rolltable). If there is a "," in the skill string. , it will be treated as an array of skills for example "nat,arc" implies that the roll result will be compared as both a nat (nat) and arcane (arc) roll |
| [options.distinct]       | `boolean`               |  false  | if checked the same result is not selected more than once indifferently from the number of 'Amount Roll' |
| [options.distinctKeepRolling]  | `boolean`         |  false  | if 'Distinct result' is checked and 'Amount Rolls' > of the numbers of the result, keep rolling as a normal 'Roll +' behavior |
| [options.usePercentage]    | `boolean`             |  false   | Use the % mechanism instead of the default formula+range behavior |
| [options.stackResultsWithBRTLogic] | `boolean`     |  false   |  if enabled the table results are stacked with the BRT logic like the module item-piles a new 'quantity' property is been added to the table result data to check how much the single result is been stacked |

**Example**:

```js
const tableEntity  = game.tables.getName("Loot Table");
game.modules.get('better-rolltables').api.generateChatLoot(tableEntity, options: { rollMode: 'blindroll'});
```

```js
// Draw from a table that contains items and add the items to a selected token's actor.

const table  = game.tables.getName("Monster Test");
const token = canvas.tokens.controlled[0];
const receiver = token?.actor;
if (!table || !receiver) {
  ui.notifications.warn("Missing table or selected token.");
  return null;
}

game.betterTables.addLootToSelectedToken(table, receiver, {displayChat:true});
```

---


### Roll compendium as rolltable

`game.modules.get("better-rolltables").api.rollCompendiumAsRolltable(compendium)` ⇒ `Promise<void>`

Roll compendium as rolltable

**Returns**: `Promise<void>` - Details of the chatcard message created

| Param                    | Type                    | Default | Description                                            |
|--------------------------|-------------------------|---------|--------------------------------------------------------|
| compendium               | `Compendium`            |         | compendium to generate content from         |

**Example**:

```js
(async () => {
const compendiumContent = await game.packs.get("name.of.the.compendium").getContent();
const table = compendiumContent .find(i => i.name === `Treasure Hoard: Challenge 11-16`);
game.modules.get("better-rolltables").api.generateLoot(table);
})()

```

---

# NEW API

WHEN I WILL FIND THE TIME...

# TODO

```
let tableHarvester = game.tables.getName("Better Harvester | Aarakocra RollTable");
game.modules.get("better-rolltables").api.retrieveItemsDataFromRollTableResultSpecialHarvester({
   table: tableHarvester,
   options: {
      rollMode: "gmroll",
      dc: 10,
      skill: "med"
   }
});


const returnArr = await game.modules.get("better-rolltables").api.retrieveItemsDataFromRollTableResultSpecialHarvester({
    table: tableHarvester,
    options: {
    rollMode: "gmroll",
    dc: dcValue,
    skill: skillDenom
    }
});

const itemsData = await game.modules.get("better-rolltables").api.retrieveItemsDataFromRollTableResult({
    table: tableHarvester,
    options: {
        rollMode: "gmroll",
        dc: dcValue,
        skill: skillDenom
    }
});


 game.modules.get("better-rolltables").api.convertTokensToItemPiles();

 game.modules.get("better-rolltables").api.convertTokensToSingleItemPile();

 game.modules.get("better-rolltables").api.resultToItemData(tableResult);

 game.modules.get('better-rolltables').api.retrieveMinDCOnTable(table);

```
