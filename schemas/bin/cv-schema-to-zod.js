#!/usr/bin/env node
const { exec } = require('child_process')
const path = require('path')

function schemaToZod(){
    const scriptPath = path.relative(
        process.cwd(),
        path.resolve(__dirname, '../scripts/cv-schema-to-zod.ts')
    );
    exec(`npx vite-node ${scriptPath} ${process.argv.slice(2).join(' ')}`, (error, stdout, stderr) => {
        if(error){
            console.error(error);
            process.exit(1);
        }
        if(stderr){
            console.error(stderr);
            process.exit(1);
        }
        console.log(stdout);
    })
}

schemaToZod();