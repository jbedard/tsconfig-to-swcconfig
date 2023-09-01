"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTSOptions = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const joycon_1 = __importDefault(require("joycon"));
const jsonc_parser_1 = require("jsonc-parser");
const deepmerge_1 = __importDefault(require("@fastify/deepmerge"));
const deepmerge = (0, deepmerge_1.default)({
    mergeArray: function replaceByClonedSource(options) {
        const clone = options.clone;
        return function (target, source) {
            return clone(source);
        };
    },
});
const joycon = new joycon_1.default();
joycon.addLoader({
    test: /\.json$/,
    loadSync: (file) => {
        const content = node_fs_1.default.readFileSync(file, 'utf8');
        return (0, jsonc_parser_1.parse)(content);
    },
});
function getTSOptions(filename = 'tsconfig.json', cwd = process.cwd()) {
    var _a;
    const { compilerOptions } = (_a = loadTsFile(filename, cwd)) !== null && _a !== void 0 ? _a : {};
    return compilerOptions !== null && compilerOptions !== void 0 ? compilerOptions : null;
}
exports.getTSOptions = getTSOptions;
function loadTsFile(filename, cwd) {
    var _a;
    let { data, path } = (_a = resolveFile(filename, cwd)) !== null && _a !== void 0 ? _a : {};
    if (!path || !data) {
        return null;
    }
    if (!data.extends) {
        return data;
    }
    const extendsArr = Array.isArray(data.extends) ? data.extends : [data.extends];
    for (let _extends of extendsArr) {
        if (!_extends.endsWith('.json')) {
            _extends += '.json';
        }
        data = deepmerge(loadTsFile(_extends, cwd), data);
    }
    return data;
}
function resolveFile(filename, cwd) {
    try {
        let { data, path } = joycon.loadSync([filename], cwd);
        if (!path || !data) {
            data = require(filename);
            path = require.resolve(filename, { paths: [cwd] });
        }
        return { data, path };
    }
    catch (e) {
        return null;
    }
}
