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
    obj = formater.format({ obj, templateMap: templateMapTwo });
    assert.strictEqual(obj.parentProp.firstChild.secondChild, 1);
    obj = formater.format({ obj, templateMap: templateMapThree });
    assert.strictEqual(obj.secondParent.childProp, 1);
  });
});
