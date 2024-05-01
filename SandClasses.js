class Particle{
    constructor(filled, cellCoords, color){
         this.filled = filled;
         this.particleType;
         this.cellX = cellCoords.x
         this.cellY = cellCoords.y;
         this.weight;
         this.isBottom = false;
         this.color = color;
         this.primaryColor;
         this.gridCoord = cellCoords;
         this.translateCoords(this.cellX, this.cellY);
         this.placeParticle(this.color);
         this.loopIteration = 0;
         this.DROP_RATE = 0; //HIGHER DROP RATE MEANS IT DROPS SLOWER
     }
 
     translateCoords(x, y){
         x *= PARTICLE_SIZE;
         y *= PARTICLE_SIZE;
         this.cellX = x - x % 4;
         this.cellY = y - x % 4; 
     }
 
     getIsBottom(){
         return this.isBottom;
     }
 
     placeParticle(color = this.color){
         ctx.fillStyle = color;
         ctx.fillRect(this.cellX, this.cellY, PARTICLE_SIZE, PARTICLE_SIZE);
     }
 
     updateColor(){
         if(this.filled){
            this.randomColor();
         }else{
             this.placeParticle(EMPTY_CELL);
         }
     }
 
     checkMove(i, j){
         this.loopIteration++;
     }
 }
 
 class SolidParticle extends Particle{
     constructor(filled, cellCoords, color){
         super(filled, cellCoords, color);
         this.superType = superTypes.Solid;
     }
}
 
 //TODO - FINISH THIS CLASS CREATION!
 class FluidParticle extends Particle{
     constructor(cellCoords, color){
         super(true, cellCoords, color);
         this.superType = superTypes.Fluid;
         this.DROP_RATE = 15;
     }
 
     checkMove(i, j){
         super.checkMove(i, j);
         let lInBounds = j - 1 >= 0;
         let rInBounds = j + PARTICLE_SIZE < ROW_SIZE;
         let inBounds = lInBounds && rInBounds;
 
         let move = getMoveFromArr();
         movesArray.pop();
 
         if (i + PARTICLE_SIZE < ROW_SIZE) {
             let down = grid[i + 1][j];
             let dL = grid[i + 1][j - 1];
             let dR = grid[i + 1][j + 1];
             let L = grid[i][j - 1];
             let R = grid[i][j + 1];
 
             if (!down.filled || down.weight < this.weight) {   //Push through even if bottom is a gas
                move = { from: { y: i, x: j }, to: { y: i + 1, x: j } };
             //If empty space either bottom left or bottom right
             }else if (inBounds && !dL.filled && !dR.filled && !L.filled && !R.filled) {
                 move = (Math.random() < 0.5) ? 
                     {from: { y: i, x: j }, to: { y: i + 1, x: j - 1 }}:
                     {from: { y: i, x: j }, to: { y: i + 1, x: j + 1 }};
             //If empty space bottom left and not bottom right
             } else if (j > 0 && !dL.filled && !L.filled  ) {
                 move = {from: { y: i, x: j }, to: { y: i + 1, x: j - 1 }};
             //If empty space bottom right and not bottom left
             } else if (j < ROW_SIZE - PARTICLE_SIZE && !dR.filled && !R.filled) {
                 move = {from: { y: i, x: j }, to: { y: i + 1, x: j + 1 }};
             }else if(inBounds && !grid[i][j - 1].filled && !grid[i][j + 1].filled){
                 move = (Math.random() < 0.5) ? 
                     {from: { y: i, x: j }, to: { y: i, x: j - 1 }} : 
                     {from: { y: i, x: j }, to: { y: i, x: j + 1 }};
             }else if(lInBounds && !L.filled){
                 move = {from: { y: i, x: j }, to: { y: i, x: j - 1 }};
             }else if(rInBounds && !R.filled){
                 move = {from: { y: i, x: j }, to: { y: i, x: j + 1 }};
             }
         }
         movesArray.push(move);
         return move;
     }
 }
 
 class Water extends FluidParticle{
     constructor(cellCoords, color){
         super(cellCoords, color);
         this.particleType = particleTypes.Water;
         this.weight = 0.8;
     }
 }
 
 class BGParticle extends SolidParticle{
     constructor(cellCoords){
         super(false, cellCoords, EMPTY_CELL);
         this.weight = 0;
         this.particleType = particleTypes.Background;
     }
 }
 
 class Stone extends SolidParticle{
     constructor(cellCoords, isBottom){
         super(true, cellCoords, STONE);
         this.isBottom = isBottom;
         this.particleType = particleTypes.Stone;
         this.weight = 10;
     }
 }
 
 class Sand extends Particle{
     constructor(filled, cellCoords, color){
         super(filled, cellCoords, color);
         this.particleType = particleTypes.Sand;
         this.weight = 3;
         this.DROP_RATE = 5;
     }
 
     updateColor(){
         if(this.filled){
             this.placeParticle(this.randomColor(SAND_LIST));
         }else{
             this.placeParticle(EMPTY_CELL);
         }
     }
 
     checkMove(i, j){
         super.checkMove(i, j);
         let inBounds = j - PARTICLE_SIZE > 0 && j + PARTICLE_SIZE < ROW_SIZE - 1;
         let down = grid[i + 1][j];
         
         let dL = grid[i + 1][j - 1];
         let dR = grid[i + 1][j + 1];
         let L = grid[i][j - 1];
         let R = grid[i][j + 1];
 
         let move = getMoveFromArr();
         movesArray.pop();
 
         // Check if the grid cell is filled
         if (i + PARTICLE_SIZE < ROW_SIZE) {
             //If empty space directly beneath particle
             if (!down.filled || down.weight < this.weight) {
                 move = {from: { y: i, x: j }, to: { y: i + 1, x: j }};
             //If empty space either bottom left or bottom right
             }else if(down.filled){
                 if (inBounds && !(dL.filled) && !(dR.filled) && !L.filled && R.filled) {
                     //Moves sand to random spot if bottom left right are both free
                     move = (Math.random() < 0.5) ? 
                         move = {from: { y: i, x: j }, to: { y: i + 1, x: j - 1 }} :
                         move = {from: { y: i, x: j }, to: { y: i + 1, x: j + 1 }};
                 //If empty space bottom left and not bottom right
                 } else if (j > 0 && !(dL.filled) && !L.filled) {
                     move = {from: { y: i, x: j }, to: { y: i + 1, x: j - 1 }};
                 //If empty space bottom right and not bottom left
                 } else if (j < ROW_SIZE - PARTICLE_SIZE - 1 && !(dR.filled) && !R.filled) {
                     move = {from: { y: i, x: j }, to: { y: i + 1, x: j + 1 }};
                 }
             }
         }
         movesArray.push(move);
         return move;
     }
 }
 
 class Gas extends Particle{
     constructor(filled, cellCoords, color){
         super(filled, cellCoords, color);
         this.superType = superTypes.Gas;
         this.primaryColor;
         this.DROP_RATE = 5;
     }
 
     updateColor(){
         if(this.filled){
             this.placeParticle(this.primaryColor);
         }else{
             this.placeParticle(EMPTY_CELL);
         }
     }
 
     checkMove(i, j){
         super.checkMove(i, j);
         let lInBounds = j - 1 >= 0;
         let rInBounds = j + PARTICLE_SIZE < ROW_SIZE;
         let inBounds = lInBounds && rInBounds;
 
         let move = getMoveFromArr();
         movesArray.pop();
         if (i - 1 > - 1) {  //Greater than top of screen
             let up = grid[i - 1][j];
             let uL = grid[i - 1][j - 1];
             let uR = grid[i - 1][j + 1];
             let L = grid[i][j - 1];
             let R = grid[i][j + 1];
 
             //If empty space directly beneath particle
             if (!up.filled) {
                 move = { from: { y: i, x: j }, to: { y: i - 1, x: j } };
             //If empty space either bottom left or bottom right
             }else if (inBounds && !uL.filled && !uR.filled && !L.filled & !R.filled) {
                 //Moves sand to random spot if bottom left right are both free
                 move = (Math.random() < 0.5) ? 
                     { from: { y: i, x: j }, to: { y: i - 1, x: j - 1 } }:
                     { from: { y: i, x: j }, to: { y: i - 1, x: j + 1} };
             //If empty space bottom left and not bottom right
             } else if (inBounds && !uL.filled && !L.filled) {
                 move = { from: { y: i, x: j }, to: { y: i + 1, x: j - 1} };
             //If empty space bottom right and not bottom left
             } else if (inBounds && !uR.filled && !R.filled) {
                 move = { from: { y: i, x: j }, to: { y: i - 1, x: j + 1} };
             } //Checks if left and right are free
             else if(inBounds && !L.filled && !R.filled){
                 move = (Math.random() < 0.5) ? 
                     {from: { y: i, x: j }, to: { y: i, x: j - 1 }} :
                     {from: { y: i, x: j }, to: { y: i, x: j + 1 }};
             }else if(lInBounds && !L.filled){
                 move = {from: { y: i, x: j }, to: { y: i, x: j - 1 }};
             }else if(rInBounds && !R.filled){
                 move = {from: { y: i, x: j }, to: { y: i, x: j + 1 }};
             }
         } 
 
         movesArray.push(move);
         return move;
    }
 }
 
class Oxygen extends Gas{
     constructor(filled, cellCoords, color){
         super(filled, cellCoords, color);
         this.particleType = particleTypes.Oxygen;
         this.primaryColor = OXYGEN;
         this.weight = 0.2;
     }
 }
 