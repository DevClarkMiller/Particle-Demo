const DROP_SPEED = 10;
const ROW_SIZE = 100;
const BOTTOM = "rgb(50, 75, 113)";
const EMPTY_CELL = "rgb(236, 227, 227)";
const PARTICLE = "rgb(0, 0, 0)";
const SAND_LIST = ["rgb(200, 212, 97)", "rgb(232, 245, 122)", 
"rgb(219, 237, 62)", "rgb(145, 158, 32)", "rgb(224, 242, 70)", "rgb(233, 245, 130)"];


var gridContainer = document.getElementById("gridContainer");
var grid = [];

function Cell(filled, cellDiv){
    this.filled = filled;
    this.cellDiv = cellDiv;
    this.cellDiv.className = "gridPoint";
    this.isBottom = false;
    this.updateColor();

    var self = this;
    this.cellDiv.onmouseover = async function(event){
        if(event.buttons === 1 && !self.filled){
            self.flipFill();
            stepAnimation();
        }
        event.preventDefault();
    };
}

Cell.prototype.randomSand = function(){
    const randomIndex = Math.floor(Math.random() * SAND_LIST.length);
    this.cellDiv.style.backgroundColor = SAND_LIST[randomIndex];
}

Cell.prototype.updateColor = function(){
    if(this.filled){
        this.randomSand();
    }else{
        this.cellDiv.style.backgroundColor = EMPTY_CELL;
    }
}

//Changes fill bool and updates colour too
Cell.prototype.flipFill = function(){
    if(this.filled){
        this.filled = false;
        this.updateColor();
    }else{
        this.filled = true;
        this.updateColor();
    }
}

function stepAnimation() {
    
    let active = false;

    let moves = [];

    function innerLoop(){
        moves = [];
        for(let i = 0; i < ROW_SIZE - 2; i++){
            for(let j = 0; j < ROW_SIZE; j++){
                var inBounds = j - 1 > 0 && j + 1 < ROW_SIZE - 1;
                var current = grid[i][j];
                var down = grid[i + 1][j];
                var downLeft = grid[i + 1][j - 1];
                var downRight = grid[i + 1][j + 1];
                // Check if the grid cell is filled
                if (current.filled && i + 1 < ROW_SIZE) {
                    //If empty space directly beneath particle
                    if (!down.filled) {
                        moves.push({ from: { row: i, col: j }, to: { row: i + 1, col: j } });
                    //If empty space either bottom left or bottom right
                    }else if (inBounds && !(downLeft.filled) && !(downRight.filled)) {
                        let draw = Math.random() < 0.5;
                        if(draw > 0.5) {
                            moves.push({ from: { row: i, col: j }, to: { row: i + 1, col: j - 1 } });
                        }else {
                            moves.push({ from: { row: i, col: j }, to: { row: i + 1, col: j + 1} });
                        }
                    //If empty space bottom left and not bottom right
                    } else if (j > 0 && !(downLeft.filled)) {
                        moves.push({ from: { row: i, col: j }, to: { row: i + 1, col: j - 1} });
                    //If empty space bottom right and not bottom left
                    } else if (j < ROW_SIZE - 1 && !(downRight.filled)) {
                        moves.push({ from: { row: i, col: j }, to: { row: i + 1, col: j + 1} });
                    }   
                
                }
            }
        }

        if(moves.length < 1){
            // Perform the movements
            active = false;
        }else{
            for (let move of moves) {
                grid[move.to.row][move.to.col].flipFill();
                grid[move.from.row][move.from.col].flipFill();
                active = true;
            }
        }
        if(active){
            setTimeout(innerLoop, DROP_SPEED);
        }   
    }
    innerLoop();
}

//Creates and populates grid
function start(){
    for(let i = 0; i < ROW_SIZE; i++){
        grid[i] = [];
        for(let j = 0; j < ROW_SIZE; j++){
            if(i === ROW_SIZE - 1){
                grid[i][j] = new Cell(true, document.createElement("div"));
                grid[i][j].cellDiv.style.backgroundColor = BOTTOM;
                grid[i][j].isBottom = true;
            }else{
                grid[i][j] = new Cell(false, document.createElement("div"));
            } 
            gridContainer.appendChild(grid[i][j].cellDiv);
        }
    }
    console.log(grid);
}