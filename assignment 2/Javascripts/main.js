import {ParfumeBottleScene} from "./Scene/ParfumeBottleScene.js";

window.onload = startCanvas();

function startCanvas() {
    drawBottle();
}

function drawBottle() {
    let canvas = document.getElementById('myCanvas');
    let scene = new ParfumeBottleScene(canvas);

    scene.start();
    animate();

    document.addEventListener("click", onMouseClick);
    document.addEventListener("keydown", onKeyDown);

    function animate() {
        scene.animate()
        requestAnimationFrame(animate);
    }

    function onMouseClick() {
        scene._onMouseClick()
    }

    function onKeyDown(event) {
        scene._onKeyDown(event)
    }
}
