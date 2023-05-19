let nutrients = {
  "Carbohydrates": [],
  "Dietary-fibre": [],
  "Fats": [],
  "Minerals": [],
  "Proteins": [],
  "Vitamins": [],
  "Water": []
};

let nutrientNames;

let nutrientConfig = {
  "Carbohydrates": {amount: 4, positionX: 75, positionY: 120},
  "Dietary-fibre": {amount: 4, positionX: 10, positionY: 10},
  "Fats": {amount: 9, positionX: 77, positionY: 220},
  "Minerals": {amount: 5, positionX: 72, positionY: 44},
  "Proteins": {amount: 12, positionX: 88, positionY: 180},
  "Vitamins": {amount: 10, positionX: 20, positionY: 58},
  "Water": {amount: 5, positionX: 100, positionY: 33, scale: 1.2} // Added scale only for Water
};

let sliders = {};

function preload() {
  nutrientNames = Object.keys(nutrients);
  for (let i = 0; i < nutrientNames.length; i++) {
    for (let j = 0; j < 5; j++) {
      nutrients[nutrientNames[i]][j] = loadImage(`images/${nutrientNames[i]}-${j+1}.svg`);
    }
  }
}

function setup() {
    let canvas = createCanvas(windowWidth/2, windowHeight);
  canvas.parent("p5Canvas");
  
  createCanvas(windowWidth/2, windowHeight);
  pixelDensity(1);

  let uiContainer = createDiv();
  uiContainer.id('ui');
  uiContainer.style('width', '50%');
  uiContainer.style('height', '100%');
  uiContainer.position(windowWidth/2, 0);

  nutrientNames.forEach((name, index) => {
    let div = createDiv();
    div.parent(uiContainer);

    let title = createElement('h2', name);
    title.parent(div);

    sliders[name] = createSlider(0, 4, 0);
    sliders[name].style('width', '100%');
    sliders[name].parent(div);

    // Create a div for step descriptions
    let stepDescriptionsDiv = createDiv();
    stepDescriptionsDiv.parent(div);
    stepDescriptionsDiv.style('display', 'flex');
    stepDescriptionsDiv.style('justify-content', 'space-between');
    
    // Create individual divs for each step
    let steps = ['very low', 'low', 'middle', 'high', 'very high'];
    steps.forEach(step => {
      let stepDescription = createDiv(step);
      stepDescription.class('step-text');
      stepDescription.parent(stepDescriptionsDiv);
    });
  });

  let resetButton = createButton('Reset');
  resetButton.mousePressed(resetSliders);
  resetButton.parent(uiContainer);

  let randomizeButton = createButton('Randomize');
  randomizeButton.mousePressed(randomizeSliders);
  randomizeButton.parent(uiContainer);

  let saveButton = createButton('Save');
  saveButton.mousePressed(saveArt);
  saveButton.parent(uiContainer);
}


function draw() {
  background(245);
  translate(windowWidth / 4, windowHeight / 2);

  let time = millis() * 0.001; // Introduce time based on the milliseconds since the program started

  nutrientNames.forEach(name => {
    for (let j = 0; j < nutrientConfig[name].amount; j++) {
      push();

      // Use sin and cos functions to create a wave effect
      let waveOffsetX = 30 * cos(j + time);
      let waveOffsetY = 30 * sin(j + time);

      // Adjust scale based on slider value - modified range to make scaling less extreme
      let scaleVal = map(sliders[name].value(), 0, 4, 0.75, 1.25);
      scale(scaleVal);

      rotate((TWO_PI * j) / nutrientConfig[name].amount);
      image(nutrients[name][sliders[name].value()], nutrientConfig[name].positionX + waveOffsetX, nutrientConfig[name].positionY + waveOffsetY);

      pop();
    }
  });

  // Overlay a guiding hexagon
  noFill(); // No fill to only draw the outline
  stroke(150); // Gray outline
  strokeWeight(2);

  let hexagonSize = min(windowWidth, windowHeight) * 0.9 * 0.5; // Make the hexagon 90% of the width of its parent

  beginShape();
  for(let a = 0; a < TWO_PI; a+= PI / 3) {
    let sx = hexagonSize * cos(a);
    let sy = hexagonSize * sin(a);
    vertex(sx, sy);
  }
  endShape(CLOSE);
  
}




// Function to check if a point is inside a regular hexagon centered at the origin
function insideHexagon(x, y, size) {
  return (
    -size <= x && x <= size &&
    -size/2 <= y && y <= size/2 &&
    y <= sqrt(3) * size - sqrt(3) * x &&
    y <= sqrt(3) * size + sqrt(3) * x &&
    y >= -sqrt(3) * size - sqrt(3) * x &&
    y >= -sqrt(3) * size + sqrt(3) * x
  );
}







function resetSliders() {
  for (let name in sliders) {
    sliders[name].value(0);
  }
}

function randomizeSliders() {
  for (let name in sliders) {
    sliders[name].value(floor(random(0, 5)));
  }
}

function saveArt() {
  saveCanvas('myArt', 'png');
}

function windowResized() {
  resizeCanvas(windowWidth/2, windowHeight);
}
