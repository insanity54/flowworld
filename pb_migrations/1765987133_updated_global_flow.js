/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2741421416")

  // update collection data
  unmarshal({
    "name": "flows"
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2734263879",
    "max": 0,
    "min": 0,
    "name": "channel",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2741421416")

  // update collection data
  unmarshal({
    "name": "global_flow"
  }, collection)

  // remove field
  collection.fields.removeById("text2734263879")

  return app.save(collection)
})
