
let widthOutput = document.getElementById("widthOutput");

let dropWidth = 1;

let playingAnimation = false;
let PARTICLE_SIZE = 4;

let movesArray = [{from: { x: -5, y: 0 }, to: { x:0, y: 0 }}];

let particleCountDiv = document.getElementById("particleCount");
let grid = [];
let gridOfFilled = [];
let particleCount = 0;
let placing = false;

function getMoveFromArr(){
    if(movesArray.length > 0){
        return movesArray[movesArray.length - 1];
    }
    return {from: { x: -5, y: 0 }, to: { x:0, y: 0 }};
}

widthSlider.oninput = () =>{
    widthOutput.textContent = widthSlider.value;
    dropWidth = Math.floor(widthSlider.value);
}

//Event listeners for the mouse
canvas.addEventListener('mousemove', function(event){
    draw(event);
});

canvas.addEventListener('mousedown', function(event){
    placing = true;
    draw(event);
});

canvas.addEventListener('mouseup', (e) =>{
    placing = false;
});

function randomColor(list = SAND_LIST){
    const randomIndex = Math.floor(Math.random() * list.length);
    color = list[randomIndex];
    return color;
}

function createParticle(particleType, coords){
    switch(particleType){  
        case particleTypes.Sand: 
            if(!grid[coords.y][coords.x].filled){
                grid[coords.y][coords.x] = new Sand(true, coords, randomColor(SAND_LIST));
            }
            break;
        case particleTypes.Oxygen:
            if(grid[coords.y][coords.x].particleType != particleType.sand && !grid[coords.y][coords.x].filled){
                grid[coords.y][coords.x] = new Oxygen(true, coords, OXYGEN);
            }   
            break;

        case particleTypes.Water:
            if(!grid[coords.y][coords.x].filled){
                grid[coords.y][coords.x] = new Water(coords, randomColor(WATER_LIST));
            }
            break;
        case particleTypes.Stone:
            grid[coords.y][coords.x] = new Stone(coords, false);
            break;
        default:
            let index = gridOfFilled.indexOf(grid[coords.y][coords.x]);
            grid[coords.y][coords.x] = new BGParticle(coords);
            if(index != -1){    //If element in the filledGrid exists
                gridOfFilled.splice(index, 1);
                particleCount--;
                particleCountDiv.textContent = `Particles on screen: ${particleCount}`;
            }
            break;
    }
    //console.log(grid[coords.y][coords.x]);
    return grid[coords.y][coords.x];
}

function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    //Divides by four and floors it so that it will accomodate for the particle size
    return {
        x: Math.floor((event.clientX - rect.left) / 4),
        y: Math.floor((event.clientY - rect.top) / 4) 
    };
}

function radBtnsValue(){
    const radioButtons = document.querySelectorAll('input[name="particleTypes"]');
    let value;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            value = parseInt(radioButton.value);
            break; // Exit loop since only one can be selected
        }
    }
    return value;
}

function checkDropWidth(coords){
    let particleType = radBtnsValue();

    //CHECK IT AS A GRID 
    for(let i = coords.x; i < coords.x + dropWidth; i++){
        for(let j = coords.y; j < coords.y + dropWidth; j++){
            let inBounds = j - 1 >= 0 && j + PARTICLE_SIZE < ROW_SIZE;
            let newCoords = {x: i, y: j};
            if(inBounds){
                drawFunc(newCoords, particleType);
            }
        }
    }
}

function drawFunc(coords, pt){
    let currentParticle = grid[coords.y][coords.x]; 
    //Don't remove this part currentParticle.particleType != pt WILL CREATE ZOMBIE PARTICLES 😇
    if(pt === particleTypes.Diagnostic){
        let log = document.getElementById("log");
            log.innerHTML = `Element index: ${gridOfFilled.indexOf(grid[coords.y][coords.x])}<br>
                Length: ${gridOfFilled.length}<br>
                Particle Type: ${currentParticle.particleType}`;
            console.log("CURRENT");
            console.log(grid[coords.y][coords.x]);
            //console.log("BELOW");
            //console.log(grid[coords.y + 1][coords.x])
            //console.log("Index in filledArr");
    }
    if(!currentParticle.getIsBottom() && pt != particleTypes.Diagnostic && currentParticle.particleType != pt){
        currentParticle = createParticle(pt, coords);  
        if(currentParticle.superType != superTypes.Solid && currentParticle.pt != particleTypes.Background){
            particleCount++;
            particleCountDiv.textContent = `Particles on screen: ${particleCount}`;
            gridOfFilled.push(currentParticle);
        }
        stepAnimation();
    }
}

draw = (e) =>{
    if(!placing){ return; }
    const mousePos = getMousePos(e);
    mousePosP.textContent = `Mouse POS:(${mousePos.x}, ${mousePos.y})`;
    checkDropWidth(mousePos);
}

function start(){
    if (canvas.getContext) {
        ctx.imageSmoothingEnabled = false; 
        const devicePixelRatio = window.devicePixelRatio || 1;  // Get ratio
        canvas.width = canvas.clientWidth * devicePixelRatio;   // Set canvas dimensions
        canvas.height = canvas.clientHeight * devicePixelRatio;
        ctx.scale(devicePixelRatio, devicePixelRatio);   
        let screenWidth = canvas.width;
        PARTICLE_SIZE = screenWidth / ROW_SIZE;
        PARTICLE_SIZE = Math.floor(PARTICLE_SIZE - PARTICLE_SIZE % 4);

        for(let i = 0; i < ROW_SIZE; i++){
            grid[i] = [];
            for(let j = 0; j < ROW_SIZE; j++){
                //Rounds then off to a nice number
                let coord = {x: j, y: i};
                if(i === ROW_SIZE - PARTICLE_SIZE){  
                    grid[i][j] = new Stone(coord, true);    //Bottom of grid, so particles don't fall through grid
                }else{
                    grid[i][j] = new BGParticle(coord);
                } 
            }
        }
    }else{
        alert("Please update browser to play! Sorry.");
    }
}

function swapParticles(fromCoord, toCoord){
    if(grid[fromCoord.y][fromCoord.x].loopIteration % grid[fromCoord.y][fromCoord.x].DROP_RATE === 0){
        let tempParticle = grid[toCoord.y][toCoord.x];
        grid[toCoord.y][toCoord.x] = grid[fromCoord.y][fromCoord.x];
        grid[fromCoord.y][fromCoord.x] = tempParticle;
    
        grid[fromCoord.y][fromCoord.x].gridCoord = fromCoord;
        grid[fromCoord.y][fromCoord.x].translateCoords(fromCoord.x, fromCoord.y);
        grid[fromCoord.y][fromCoord.x].placeParticle();
    
        grid[toCoord.y][toCoord.x].gridCoord = toCoord;
        grid[toCoord.y][toCoord.x].translateCoords(toCoord.x, toCoord.y);
        grid[toCoord.y][toCoord.x].placeParticle();
    }
}

let active = false;
let moves = {particle: null, move: null};
let gridLength;

function stepAnimation() {
    moves = [];

    gridLength = gridOfFilled.length;
    for(let i = 0; i < gridLength; i++){
        let current = gridOfFilled[i];
        if(current.filled && current.superType != superTypes.Solid){
            let move = current.checkMove(current.gridCoord.y, current.gridCoord.x);
            if(move.from.x != -5){
                let moveObj = {particle: current, mv: move};
                moves.push(moveObj);
            }
        }
    }

    if(moves.length < 1){
        //End animation
        active = false;
    }else{
        for (let moveObj of moves) {
            swapParticles(moveObj.mv.from, moveObj.mv.to);
            active = true;
        }
    }

    if(active){
        setTimeout(stepAnimation, DROP_SPEED);
    }   
}