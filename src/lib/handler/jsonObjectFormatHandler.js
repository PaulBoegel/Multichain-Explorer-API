const { value } = require("numeral");

function JsonObjectFormatHandler() {
  let newObject;

  function _changePropertyName({ name, newName }) {
    const objEntries = Object.entries(newObject);
    const propertyArray = objEntries.find((entry) => entry[0] === name);
    Object.defineProperty(newObject, newName, {
      value: propertyArray[1],
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }

  function _getValueOutOfArrayObjects(property, hierachy, index) {
    let value = [];
    let deleteProperty = false;
    const [propName, propValue] = property;
    propValue.forEach((item) => {
      if (typeof item !== "object") {
        value.push(item);
        deleteProperty = true;
        return;
      }
      const valueObj = _getValueInHierachy(
        hierachy.slice(index),
        Object.entries(item)
      );
      if (valueObj.deleteProperty) delete item[valueObj.propName];
      value.push(valueObj.value);
    });
    return { value, deleteProperty, propName };
  }

  function _getValueInHierachy(hierachy, entries) {
    let value;
    let property = entries.find((entry) => entry[0] === hierachy[0]);
    for (let index = 1; index < hierachy.length + 1; index++) {
      if (!property) return;
      if (property[1] instanceof Array) {
        return _getValueOutOfArrayObjects(property, hierachy, index);
      }
      if (typeof property[1] !== "object") {
        value = property[1];
        break;
      }
      property = Object.entries(property[1]).find(
        (entry) => entry[0] === hierachy[index]
      );
    }
    return { value, deleteProperty: false, propName: property[0] };
  }

  function _deletePropertyInHierachy(hierachy, obj) {
    let value;
    for (hierachyEntry of hierachy) {
      const objMap = new Map(Object.entries(obj));
      value = objMap.get(hierachyEntry);
      if (typeof value === "object") {
        hierachy.shift();
        if (value instanceof Array) {
          value.forEach((item) => _deletePropertyInHierachy(hierachy, item));
          return;
        }
        _deletePropertyInHierachy(hierachy, value);
        return;
      }
      delete obj[hierachyEntry];
    }
  }

  function _createProperty(obj, name, value, hierachy) {
    const config = { writable: true, configurable: true, enumerable: true };
    if (hierachy.length > 0) {
      const propertyName = hierachy.shift();
      return Object.defineProperty(obj, name, {
        value: _createProperty({}, propertyName, value, hierachy),
        ...config,
      });
    }
    return Object.defineProperty(obj, name, {
      value,
      ...config,
    });
  }

  function _createNewPropertyInHierachy(hierachy, obj, value) {
    const propertyName = hierachy.shift();
    const objValue = obj[propertyName];
    // if (typeof objValue === "object") {
    //   if (objValue instanceof Array) {
    //     objValue.forEach((item) =>
    //       _createNewPropertyInHierachy(hierachy, item, value)
    //     );
    //     return;
    //   }
    //   _createNewPropertyInHierachy(hierachy, objValue, value);
    //   return;
    // }

    _createProperty(obj, propertyName, value, hierachy);
  }

  function _changePropertyHierachy({ hierachy, newHierachy }) {
    let { value } = _getValueInHierachy(hierachy, Object.entries(newObject));

    if (newHierachy.length === 1) {
      Object.defineProperty(newObject, newHierachy[0], {
        value,
        writable: true,
        configurable: true,
        enumerable: true,
      });

      return;
    }

    _createNewPropertyInHierachy(newHierachy, newObject, value);
  }

  return {
    format({ obj, templateMap }) {
      newObject = obj;
      for (item of templateMap) {
        let hierachy = [];
        const [key, value] = item;
        switch (typeof value) {
          case "string":
            hierachy = key.split(".");
            const newHierachy = value.split(".");
            if (hierachy.length > 1 || newHierachy.length > 1) {
              _changePropertyHierachy({ hierachy, newHierachy });
              break;
            }
            _changePropertyName({ name: key, newName: value });
            delete newObject[key];
            break;
          case "boolean":
            hierachy = key.split(".");
            if (hierachy.length > 1)
              _deletePropertyInHierachy(hierachy, newObject);
            if (value === false) delete newObject[key];
            break;
        }
      }
      return newObject;
    },
  };
}

module.exports = JsonObjectFormatHandler;
