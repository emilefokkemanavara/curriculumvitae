import { PluginOption, ResolvedConfig } from 'vite';
import navaraCvSchema from 'navara-cv/schema.json' with { type: 'json'}
import curriculumVitaeSchema from 'curriculumvitae-schemas/curriculumvitae.json' with {type: 'json'}

export interface JsonSchema {
    fileName: string
    getContent: () => string
}

const schemas: JsonSchema[] = [
    {
        fileName: 'schemas/navara-cv.json',
        getContent() {
            return JSON.stringify(navaraCvSchema);
        },
    },
    {
        fileName: 'schemas/curriculumvitae.json',
        getContent() {
            return JSON.stringify(curriculumVitaeSchema);
        },
    }
];

function resolveJsonSchemaModules(schemas: JsonSchema[]): PluginOption {
    let config: ResolvedConfig;
    return {
        name: 'vite-plugin-resolve-json-schema-modules',
        configResolved(c) {
            config = c;
        },
        resolveId(source) {
            const match = source.match(/^\/(.*\.json)\?url$/);
            if(!match){
                return undefined;
            }
            const schema = schemas.find(s => s.fileName === match[1]);
            if(!schema){
                return;
            }
            const result = `\0url:${match[1]}`;
            console.log(`resolved ${source} to ${result}`)
            return result;
        },
        load(id, options) {
            const match = id.match(/url:(.*\.json)$/);
            if(!match){
                return;
            }
            const schema = schemas.find(s => s.fileName === match[1]);
            if(!schema){
                return;
            }
            const result = JSON.stringify(`${config?.base}${schema.fileName}`);
            console.log(`Loaded '${id}' as ${result}`)
            return result;
        },
    }
}

function serveJsonSchemas(schemas: JsonSchema[]): PluginOption {
    let config: ResolvedConfig;
    return {
        name: 'vite-plugin-serve-json-schemas',
        apply: 'serve',
        configResolved(c) {
            config = c;
        },
        configureServer(server){
            server.middlewares.use((req, res, next) => {
                const url = req.url;
                if(!url){
                    return next();
                }
                const match = url.match(new RegExp(`${config.base}(.*\\.json)$`));
                if(!match){
                    return next();
                }
                const schema = schemas.find(s => s.fileName === match[1]);
                if(!schema){
                    return next();
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(schema.getContent());
            })
        }
    }
}

function addJsonSchemas(schemas: JsonSchema[]): PluginOption[] {
    
    return [
        resolveJsonSchemaModules(schemas),
        serveJsonSchemas(schemas),
        {
            name: 'vite-plugin-emit-json-schemas',
            apply: 'build',
            async buildEnd(){
                for(const schema of schemas){
                    const content = schema.getContent();
                    this.emitFile({
                        type: 'asset',
                        source: content,
                        fileName: schema.fileName
                    })
                }
            }
        }
    ]
}

const addThem = () => addJsonSchemas(schemas)

export { addThem as addJsonSchemas }