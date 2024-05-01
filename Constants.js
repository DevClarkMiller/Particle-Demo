const mousePosP = document.getElementById("mousePOS");
const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");
const widthSlider = document.getElementById("slider");
const DROP_SPEED = 0;
const ROW_SIZE = 128;

//VARYING COLOURS
const SAND_LIST = ["rgb(246,215,176)", "rgb(242,210,169)", 
"rgb(236,204,162)", "rgb(231,196,150)", "rgb(225,191,146)"];
const WATER_LIST = ["rgb(65,107,223)", "rgb(93,151,231)", 
"rgb(62,164,240)"];
//VARYING COLOURS

//CONST COLOURS
const BOTTOM = "rgb(50, 75, 113)";
const EMPTY_CELL = "rgb(236, 227, 227)";
const PARTICLE = "rgb(0, 0, 0)";
const OXYGEN = "rgb(180, 193, 207)";
const STONE = "#6D717A";
//CONST COLOURS

//Enums
const particleTypes = {
    Water: 0,
    Sand: 1,
    Oxygen: 2,
    Background: 3,
    Stone: 4,
    Diagnostic: 5,
};

const superTypes = {
    Solid: 1,
    Fluid: 2,
    Gas: 3
};