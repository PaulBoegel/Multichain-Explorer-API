JsonObjectFormater = require("../src/lib/handler/jsonObjectFormatHandler");
const { assert } = require("chai");
const JsonObjectFormatHandler = require("../src/lib/handler/jsonObjectFormatHandler");

describe("BitcoinTransactionFormater format", () => {
  it("should return the input if the template is empty", () => {
    let obj = { property: 1 };
    const templateMap = new Map();
    const formater = JsonObjectFormatHandler();
    obj = formater.format({ obj, templateMap });
    assert.strictEqual(obj.property, 1);
  });
  it("should change property names of objects as determined in template", () => {
    let obj = { property: 1 };
    const templateMap = new Map();
    templateMap.set("property", "newProperty");
    const formater = JsonObjectFormatHandler();
    obj = formater.format({ obj, templateMap });
    assert.strictEqual(obj.newProperty, 1);
  });
  it("should hold all propertys not defined in template", () => {
    let obj = { firstProperty: 1 };
    const templateMap = new Map();
    const formater = JsonObjectFormatHandler();
    obj = formater.format({ obj, templateMap });
    assert.strictEqual(obj.firstProperty, 1);
  });
  it("should delte propertys if set to 0 in template", () => {
    let obj = { firstProperty: 1, secondProperty: 2 };
    const templateMap = new Map();
    templateMap.set("secondProperty", false);
    const formater = JsonObjectFormatHandler();
    obj = formater.format({ obj, templateMap });
    assert.strictEqual(obj.firstProperty, 1);
    assert.strictEqual(obj.secondProperty, undefined);
  });
  it("should delete propertys in object structure, if set to 0 in template", () => {
    let obj = { property: { child: 1 } };
    const templateMap = new Map();
    templateMap.set("property.child", false);
    const formater = JsonObjectFormatHandler();
    obj = formater.format({ obj, templateMap });
    assert.strictEqual(obj.property.child, undefined);
  });
  it("should delete propertys in array structure, if set to 0 in template", () => {
    let obj = { property: [{ child: 1 }, { child: 2 }] };
    const templateMap = new Map();
    templateMap.set("property.child", false);
    const formater = JsonObjectFormatHandler();
    obj = formater.format({ obj, templateMap });
    assert.strictEqual(obj.property[0].child, undefined);
    assert.strictEqual(obj.property[1].child, undefined);
  });
  it("should change the hierachie of a property if determined in template", () => {
    let obj = { parentProp: { childProp: 1 }, prop: 1 };
    const templateMapOne = new Map();
    const templateMapTwo = new Map();
    const templateMapThree = new Map();
    templateMapOne.set("parentProp.childProp", "parentProp");
    templateMapTwo.set(
      "parentProp.childProp",
      "parentProp.firstChild.secondChild"
    );
    templateMapThree.set("prop", "secondParent.childProp");

    const formater = JsonObjectFormatHandler();
    obj = formater.format({ obj, templateMap: templateMapOne });
    assert.strictEqual(obj.parentProp, 1);
    obj = obj = { parentProp: { childProp: 1 }, prop: 1 };
    obj = formater.format({ obj, templateMap: templateMapTwo });
    assert.strictEqual(obj.parentProp.firstChild.secondChild, 1);
    obj = obj = { parentProp: { childProp: 1 }, prop: 1 };
    obj = formater.format({ obj, templateMap: templateMapThree });
    assert.strictEqual(obj.secondParent.childProp, 1);
  });
  it("should change the hierachie in array values with embeded objects", () => {
    let obj = { property: [{ child: 1 }, { child: 2 }] };
    const templateMap = new Map();
    templateMap.set("property.child", "newProperty");
    const formater = JsonObjectFormatHandler();
    obj = formater.format({ obj, templateMap });
    assert.strictEqual(typeof obj.newProperty[0], "number");
    assert.strictEqual(typeof obj.newProperty[1], "number");
  });
  it("should extract property with array value out of embeded objects in array", () => {
    let obj = { property: [{ child: [1, 2] }, { child: [3, 4] }] };
    const templateMap = new Map();
    templateMap.set("property.child", "newProperty");
    const formater = JsonObjectFormatHandler();
    obj = formater.format({ obj, templateMap });
    assert.strictEqual(obj.newProperty[0] instanceof Array, true);
    assert.strictEqual(obj.newProperty[0].length, 2);
    assert.strictEqual(obj.newProperty[1] instanceof Array, true);
    assert.strictEqual(obj.newProperty[1].length, 2);
  });
  it.only("should change properties in array objects without deleting the other properties in the object", () => {
    let obj = { property: [{ child: 1, secondChild: [2] }] };
    const templateMap = new Map();
    templateMap.set("property.secondChild", "property.newSecondChild");
    const formater = JsonObjectFormatHandler();
    obj = formater.format({ obj, templateMap });
    assert.strictEqual(obj.property[0].newSecondChild[0], 2);
    assert.strictEqual(obj.property[0].child, 1);
  });
});
