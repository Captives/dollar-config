'use strict';

const Ajv = require('ajv');
const ajv = require('../ajv')(new Ajv());
const validate = ajv.compile({ dynamic: { type: 'number' } });

describe('ajvDynamic', () => {
    it('validates against original schema', () => {
        expect(validate(1)).to.be.true;
        expect(validate('1')).to.be.false;
    });

    it('validates against extended schema', () => {
        expect(validate({ $ref: 'foo' })).to.be.true;
        expect(validate({ $ref: 1 })).to.be.false;
    });

    it('supports circular self-references', () => {
        expect(validate({ $ref: 'foo', $default: { $ref: 'bar' } })).to.be.true;
        expect(validate({ $ref: 'foo', $default: { $ref: 1 } })).to.be.false;
    });

    it('caches created schemas', () => {
        const validate = ajv.compile({
            type: 'object',
            properties: {
                foo: { dynamic: { type: 'number' } },
                bar: { dynamic: { type: 'number' } }
            }
        });
        expect(validate.refs).to.eql({ '/c814f144-cb8d-5269-93c4-da79a8b2f6cd': 1 });
    });
});