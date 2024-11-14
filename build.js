const fs = require("fs").promises;
const { exec } = require("child_process");

async function execAsync() {
    return new Promise((resolve, reject) => {
        exec(...arguments, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

async function build() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log("Usage: node build.js <project>");
        return;
    }

    switch (args[0]) {
        case "test":
            return await buildRelease();
        default:
            console.log(`Unknown build type: ${args[0]}`);
            return 1;
    }      
}

async function buildRelease() {
    console.log("building application for release...");

    const manifest = JSON.parse(await fs.readFile("./src/static/manifest.json", "utf8"));
    const nodePackage = JSON.parse(await fs.readFile("package.json", "utf8"));
        
    //parse
    const version = manifest.version;
    const entriePoints = manifest.entry_points;

    //checks
    if (version !== nodePackage.version) {
        console.log(`Version mismatch between manifest.json (${manifest.version}) and package.json (${nodePackage.version}).`)
        return 1;
    }
    if (!entriePoints) {
        console.log("No entry points found in manifest.json.");
        return 1;
    }
    
}

build().catch((error) => {
    console.error(error);
    process.exit(1);
});