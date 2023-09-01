import type swcType from '@swc/core';
import type tsType from 'typescript';
export declare function convert(
/** filename to tsconfig */
filename?: string, 
/** cwd */
cwd?: string, 
/** swc configs to override */
swcOptions?: swcType.Options): swcType.Options;
export declare function convertTsConfig(tsOptions: tsType.CompilerOptions, swcOptions?: swcType.Options): swcType.Options;
