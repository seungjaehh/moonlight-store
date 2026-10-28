import {cp,mkdir,unlink} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
await mkdir(new URL('docs/',root),{recursive:true});
// Remove only obsolete assets from the prior game; all paths are fixed project outputs.
for(const name of ['game.mjs','app.mjs','art.mjs','style.css','favicon.svg']){
  await unlink(new URL(`docs/${name}`,root)).catch(e=>{if(e.code!=='ENOENT')throw e;});
}
await cp(new URL('dist/',root),new URL('docs/',root),{recursive:true});
console.log('GitHub Pages files prepared in docs/.');
