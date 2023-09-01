"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTsConfig = exports.convert = void 0;
const utils_1 = require("./utils");
const deepmerge_1 = __importDefault(require("@fastify/deepmerge"));
const deepmerge = (0, deepmerge_1.default)();
function convert(
/** filename to tsconfig */
filename = 'tsconfig.json', 
/** cwd */
cwd = process.cwd(), 
/** swc configs to override */
swcOptions) {
    var _a;
    const tsOptions = (_a = (0, utils_1.getTSOptions)(filename, cwd)) !== null && _a !== void 0 ? _a : {};
    return convertTsConfig(tsOptions, swcOptions);
}
exports.convert = convert;
function convertTsConfig(tsOptions, swcOptions = {}) {
    // https://json.schemastore.org/tsconfig
    const { esModuleInterop = false, sourceMap = 'inline', // notice here we default it to 'inline' instead of false
    importHelpers = false, experimentalDecorators = false, emitDecoratorMetadata = false, target = 'es3', module, jsx: _jsx, jsxFactory = 'React.createElement', jsxFragmentFactory = 'React.Fragment', jsxImportSource = 'react', alwaysStrict = false, noImplicitUseStrict = false, paths, baseUrl, } = tsOptions;
    const jsx = _jsx === null || _jsx === void 0 ? void 0 : _jsx.toLowerCase();
    const jsxRuntime = jsx === 'react-jsx' || jsx === 'react-jsxdev' ? 'automatic' : undefined;
    const jsxDevelopment = jsx === 'react-jsxdev' ? true : undefined;
    const transformedOptions = deepmerge({
        sourceMaps: sourceMap,
        module: {
            type: moduleType(module),
            strictMode: alwaysStrict || !noImplicitUseStrict,
            noInterop: !esModuleInterop,
        },
        jsc: {
            externalHelpers: importHelpers,
            target: target,
            parser: {
                syntax: 'typescript',
                tsx: true,
                decorators: experimentalDecorators,
                dynamicImport: true,
            },
            transform: {
                legacyDecorator: true,
                decoratorMetadata: emitDecoratorMetadata,
                react: {
                    throwIfNamespace: false,
                    development: jsxDevelopment,
                    useBuiltins: false,
                    pragma: jsxFactory,
                    pragmaFrag: jsxFragmentFactory,
                    importSource: jsxImportSource,
                    runtime: jsxRuntime,
                },
            },
            keepClassNames: !['es3', 'es5', 'es6', 'es2015'].includes(target.toLowerCase()),
            paths,
            baseUrl,
        },
    }, swcOptions);
    return transformedOptions;
}
exports.convertTsConfig = convertTsConfig;
const availableModuleTypes = ['commonjs', 'amd', 'umd', 'es6'];
function moduleType(m) {
    const module = m === null || m === void 0 ? void 0 : m.toLowerCase();
    if (availableModuleTypes.includes(module)) {
        return module;
    }
    const es6Modules = ['es2015', 'es2020', 'es2022', 'esnext'];
    if (es6Modules.includes(module)) {
        return 'es6';
    }
    return 'commonjs';
}
