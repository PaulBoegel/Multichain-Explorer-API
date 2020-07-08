const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const ConfigurationHandler = require('../../server/handler/configurationHandler');

chai.use(chaiAsPromised);
chai.should();

describe('ConfigurationHandler', function(){

  const confHandler = new ConfigurationHandler(fs);
  const appRoot = process.env.PWD;

  describe('readAndParseJsonFile', function(){

    it('should read the file and parse to json', function(){
      const filePath = `${appRoot}/tests/mocks/json-file.json`;
      const readFileSync = sinon.stub(fs, 'readFileSync').returns(true);
      const parse = sinon.stub(JSON, 'parse').returns(true)
      confHandler.readAndParseJsonFile(filePath);

      readFileSync.firstCall.args[0].should.equal(filePath);
      parse.firstCall.args[0].should.equal(true);
    });

  });

});
