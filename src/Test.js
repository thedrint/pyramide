
import Colors from './Colors';
import Utils from './Utils';

export default class Test {

	constructor () {}

	static getPath (JohnWick, BadGuy) {
		let pathCoords = [];
		let testCode = () => {
			// this.getMap(true);
			pathCoords = JohnWick.getPathTo(BadGuy);
		}

		let res = Utils.perfTest('create map and calculate path', 10, testCode);
		console.log(`${res.name} in ${res.result.duration/res.n}ms (${res.result.duration}ms for ${res.n} tests)`);

		JohnWick.scene.drawPath(JohnWick, Colors.pink, 16, ...pathCoords);

		this.showMeasures();
	}

	static seekAndDestroy (scene) {
		Utils.perfTest(`seekAndDestroy`, 10, (iteration) => {
			scene.fighters.forEach( fighter => {
				scene.seekAndDestroy(fighter);
			});
		}, false);
		console.log('Test completed!!!');
	}

	static getWeaponAngle (JohnWick, BadGuy) {
		JohnWick.getWeaponTargetAngle(BadGuy);
	}

	static showMeasures () {
		let measures = [
			// 'checkInMainPoly', 
			'checkInTooClose', 
			'checkMiddlePointInside', 
			'checkEdgesForCross', 
			'InLineOfSight', 
			'selfCrossing', 
			'vertexCollect', 
			'calculatePath', 
			'PathfindAlgorithm', 
			'pointInside', 
			'LineSegmentsCross', 
		];
		let table = measures
			.reduce((a,v)=>{ return [...a,[v,Utils.sumPerf(v)]] }, []);
		table.push(['createGraph', Utils.avgPerf('createGraph')]);
		console.table(table)
		performance.clearMarks();		
		performance.clearMeasures();		
	}

}