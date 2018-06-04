import { Diagnostic } from "../../compiler";
import { DefaultFileSystemHost, FileSystemHost, FileSystemWrapper } from "../../fileSystem";
import { CompilerOptions } from "../../typescript";
import { TsConfigResolver } from "./TsConfigResolver";

export interface CompilerOptionsFromTsConfigOptions {
    encoding?: string;
    fileSystem?: FileSystemHost;
}

export interface CompilerOptionsFromTsConfigResult {
    options: CompilerOptions;
    errors: Diagnostic[];
}

/**
 * Gets the compiler options from a specified tsconfig.json
 * @param filePath - File path to the tsconfig.json.
 * @param options - Options.
 */
export function getCompilerOptionsFromTsConfig(filePath: string, options: CompilerOptionsFromTsConfigOptions = {}): CompilerOptionsFromTsConfigResult {
    // remember, this is a public function
    const fileSystemWrapper = new FileSystemWrapper(options.fileSystem || new DefaultFileSystemHost());
    const tsConfigResolver = new TsConfigResolver(fileSystemWrapper, filePath, options.encoding || "utf-8");
    return {
        options: tsConfigResolver.getCompilerOptions(),
        errors: tsConfigResolver.getErrors()
    };
}
