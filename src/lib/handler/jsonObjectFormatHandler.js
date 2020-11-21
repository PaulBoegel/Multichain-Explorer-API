function JsonObjectFormatHandler() {
  let newObject;
  let objEntries;

  function _changePropertyName({ name, newName }) {
    const propertyArray = objEntries.find((entry) => entry[0] === name);
    Object.defineProperty(newObject, newName, {
      value: propertyArray[1],
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }

  function _changePropertyHierachy({ hierachy, newHierachy }) {
    let value;
    let newProperty;
    let property = objEntries.find((entry) => entry[0] === hierachy[0]);

    for (let index = 1; index < hierachy.length + 1; index++) {
      if (!property) return;
      if (typeof property[1] !== "object" || property[1] instanceof Array) {
        value = property[1];
        break;
      }
      property = Object.entries(property[1]).find(
        (entry) => entry[0] === hierachy[index]
      );
    }

    if (newHierachy.length === 1) {
      Object.defineProperty(newObject, newHierachy[0], {
        value,
        writable: true,
        configurable: true,
        enumerable: true,
      });

      return;
    }

    newProperty = value;
    for (let index = newHierachy.length - 1; index >= 0; index--) {
      newProperty = Object.defineProperty({}, newHierachy[index], {
        value: newProperty,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    Object.assign(newObject, newProperty);
  }

  return {
    format({ obj, templateMap }) {
      objEntries = Object.entries(obj);
      newObject = {};
      for (item of templateMap) {
        const [key, value] = item;
        switch (typeof value) {
          case "string":
            const hierachy = key.split(".");
            const newHierachy = value.split(".");
            if (hierachy.length > 1 || newHierachy.length > 1) {
              _changePropertyHierachy({ hierachy, newHierachy });
              break;
            }
            _changePropertyName({ name: key, newName: value });
            delete obj[key];
          case "boolean":
            if (value === false) delete obj[key];
            break;
        }
      }
      return Object.assign(obj, newObject);
    },
  };
}

module.exports = JsonObjectFormatHandler;
