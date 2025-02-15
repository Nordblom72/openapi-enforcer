/**
 *  @license
 *    Copyright 2018 Brigham Young University
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 **/
'use strict';
const EnforcerRef   = require('../enforcer-ref');
const RequestBody   = require('./RequestBody');
const util          = require('../util');

const rxContentTypeMime = /(?:^multipart\/)|(?:^application\/x-www-form-urlencoded$)/;

module.exports = {
    init: function (data) {
        const { exception } = data;
        util.validateExamples(this, exception);
    },

    prototype: {},

    validator: function (data) {
        return {
            type: 'object',
            properties: {
                encoding: {
                    type: 'object',
                    allowed: ({ parent }) => parent.parent.parent.validator === RequestBody.validator,
                    additionalProperties: EnforcerRef('Encoding'),
                    errors: ({ exception, key, parent }) => {
                        if (!rxContentTypeMime.test(parent.key)) {
                            exception.message('Mime type must be multipart/* or application/x-www-form-urlencoded. Found: ' + parent.key);
                        }
                    }
                },
                example: { allowed: true, freeForm: true },
                examples: {
                    type: 'object',
                    additionalProperties: EnforcerRef('Example')
                },
                schema: EnforcerRef('Schema')
            },
            errors: ({ parent, key, warn }) => {
                if (parent && parent.key === 'content') {
                    if (!module.exports.rx.mediaType.test(key)) warn.message('Media type appears invalid');
                }
            }
        }
    },

    rx: {
        mediaType: /^(application|audio|example|font|image|message|model|multipart|text|video|x-\S+)\/(?:([a-z.\-]+)\+)?([a-z.\-]+)(?:; *(.+))?$/
    }
};
