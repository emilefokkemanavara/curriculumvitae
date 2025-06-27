import path from 'path'
import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises';
import { program } from 'commander'
import { resolveRefsAt, UnresolvedRefDetails } from 'json-refs';
import { jsonSchemaToZod } from "json-schema-to-zod";

program
    .requiredOption('-i, --input <input file>', 'the json schema to convert')
    .requiredOption('-o, --output <output file>', 'the path of the output typescript file')
    .requiredOption('-s --schemaName <schema name>', 'the name of the zod schema to export')
    .requiredOption('-t --typeName <type name>', 'the name of the inferred type to export');

program.parse();

const frontendServePathUrl = new URL('..', import.meta.url);
async function schemaToZod({
    input,
    output,
    schemaName,
    typeName
}: {
    input: string,
    output: string
    schemaName: string
    typeName: string
}): Promise<void> {
    const result = await resolveRefsAt(input, {
        refPreProcessor(obj){
            if(!('$ref' in obj)){
                return obj;
            }
            const { $ref, ...rest} = obj;
            if(typeof $ref !== 'string'){
                return obj;
            }
            try{
                const url = new URL($ref, frontendServePathUrl);
                return {
                    ...rest,
                    $ref: url.toString()
                }
            }catch{
                return obj;
            }
            return obj;
        }
    });
    for(const ref in result.refs){
        if(!Object.hasOwn(result.refs, ref)){
            continue;
        }
        const refResult: UnresolvedRefDetails = result.refs[ref];
        if(refResult.error){
            throw new Error(`Could not resolve ${refResult.uri}`)
        }
    }
    const zodModule = jsonSchemaToZod(result.resolved, {
        name: schemaName,
        type: typeName,
        module: 'esm'
    });
    const targetFile = path.resolve(process.cwd(), output);
    const dirName = path.dirname(targetFile);
    if(!existsSync(dirName)){
        await mkdir(dirName, {recursive: true})
    }
    await writeFile(targetFile, zodModule);
}

schemaToZod(program.opts());