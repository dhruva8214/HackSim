async function check() {
    try {
        await import('./src/engine/missions/chapter9_iot.js');
        console.log("VALID");
    } catch (e) {
        console.log("ERROR at line", e.stack.split('\n')[1]);
        console.log(e.message);
        console.log(e);
    }
}
check();
