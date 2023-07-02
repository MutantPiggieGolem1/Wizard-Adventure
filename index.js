// initial state constants
const moveMap = { "w": [0, -1], "s": [0, 1], "a": [-1, 0], "d": [1, 0] }
const interactables = { "🌹": "🥀", "🥀": "🍁", "🍄": "🍂", "🌳": false, "🌲": false }
const player = "🧙"
const goal = "🔮"
const blank = "⬛"
const grid = []

//create the map
const elements = Object.keys(interactables).filter(k => !Object.values(interactables).includes(k))
for (let r = 0; r < 100; r++) {
	grid[r] = []
	for (let c = 0; c < 100; c++) {
		grid[r][c] = Math.random() > 0.6 ? elements[Math.floor(Math.random() * elements.length)] : blank;
	}
}
grid[Math.floor(Math.random() * grid.length)][Math.floor(Math.random() * grid[0].length)] = goal;

//gameplay variables
let px = Math.floor(Math.random() * grid.length)
let py = Math.floor(Math.random() * grid[0].length)
let dist = 0
const interactCounts = Object.fromEntries([...Object.keys(interactables).map(k => [k, 0]), [blank, 0], [goal, 0]])

grid[py][px] = blank;

function normalize(i, len) {return (i >= 0 ? i : Math.ceil(-i / len) * len + i) % len}

// handle input
document.onkeyup = (e) => e.key in moveMap ? move(...moveMap[e.key]) : null
function move(dx, dy) {
	const coords = [normalize(py + dy, grid.length), normalize(px + dx, grid[0].length)]
	let toMove = grid[coords[0]][coords[1]]
	interactCounts[toMove]++;
	if (interactables[toMove] === false) return;
	dist++;
	grid[coords[0]][coords[1]] = interactables[toMove] ?? toMove;
	[py, px] = coords
	checkWin()
}
function checkWin() {
	if (interactCounts[goal] <= 0) return;
	clearInterval(renderLoop)
	const canvas = document.getElementById("canvas");
	canvas.style.transform = "scale(2)"
	canvas.innerHTML = `
You found the crystal ball!
Your wizard adventure has reached its terminus.
Flowers squished: ${interactCounts['🌹']}
Flowers crushed: ${interactCounts['🥀']}
Mushrooms picked: ${interactCounts['🍄']}
Trees hugged: ${interactCounts['🌳']+interactCounts['🌲']}
Land trod: ${interactCounts[blank]}
Distance Travelled: ${dist}
Congratulations!`
}

// handle rendering
const renderLoop = setInterval(() => document.getElementById("canvas").innerHTML = viewport(), 1000/30)
function viewport() {
	let a = normalize(py - 5, grid.length)
	let b = normalize(py + 5, grid.length)
	return (a <= b ? grid.slice(a, b) : [...grid.slice(a), ...grid.slice(0, b)]).map((row, i, fa) => {
		row = [...row]
		if (i === fa.length/2) row[px] = player;
		let c = normalize(px - 5, row.length)
		let d = normalize(px + 5, row.length)
		return (c <= d ? row.slice(c, d) : [...row.slice(c), ...row.slice(0, d)]).map(c => `<span class="specialchar">${c}</span>`).join("")
	}).join("<br>")
}
