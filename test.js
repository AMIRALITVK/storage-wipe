const { exec, spawn, execSync, spawnSync } = require('child_process');
var { stdout, stderr } = require('process');


function test() {
    const ls = exec('ls');
    ls.stdout.on('data', (data) => {
        console.log(data.toString());
    })
    ls.stdout.on('error', (data) => {
        console.log(data.toString());
    })
}


test();