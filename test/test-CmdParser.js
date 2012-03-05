var vows = require('vows');
var assert = require('assert');
var parser = require('cmdParser');

function ctx(topic) {
    this.topic = topic
}

function given(input) {
    var context =  new ctx(function() {
                            return parser.parse(input)
                        })
    return context
}
ctx.prototype.attr = function(prop) {
    this.p = prop;
    this.msg = prop + ' should be ';
    return this
}

ctx.prototype.shouldBe = function(value) {
    console.log('prop = ' + this.p);
    var prop = this.p;
    this[this.msg + value] = function(topic) {
        assert.equal(topic[prop], value);
    }
    delete this.msg;
    delete this.p;
    return this;
}

console.log(given('#xxxx').attr('command').shouldBe('00'));

var suite = vows.describe('command parser test');
suite.addBatch({
    'given input %00,ver032a=000001100#': given('%00,ver032a=000001100#')
        .attr('command').shouldBe('00')
        .attr('machineId').shouldBe('000001')
        .attr('status').shouldBe('1')
        .attr('version').shouldBe('ver032a'),


    '[template] given input %00,ver032a=000001100#': {
        topic: function() {
            return parser.parse('%00,ver032a=000001100#');
        },
        "command should be 00": function(topic) {
            assert.equal('00', topic.command);
        },
        "status should be 1": function(topic) {
            assert.equal('1', topic.status);
        },
        "machineId should be 000001": function(topic) {
            assert.equal('000001', topic.machineId);
        },
        "version should be ver032a": function(topic) {
            assert.equal('ver032a', topic.version);
        }
    },
    'given input %010101=087111000100#': {
        topic: function() {
            return parser.parse('%010101=087111000100#');
        },
        "command should be 01": function(topic) {
            assert.equal('01', topic.command);
        },
        "typeMenu shoud be 01": function(topic) {
            assert.equal('01', topic.typeMenu);
        },
        "provider should be 01": function(topic) {
            assert.equal('01', topic.provider);
        },
        "phoneNumber should be 0871110001": function(topic) {
            assert.equal('0871110001', topic.phoneNumber);
        }
    }


}).export(module);