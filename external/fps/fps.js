/**
 * FPS Module
 *
 * Calculates frames per second on each tick
 */
(function(window) {
	"use strict";

	/**
	 * Constructor
	 *
	 * @param   object   opt   Options
	 */
 	function FPS(opt) {
		
		this.opt = opt || {};
		this.last = 0;
		this.lastFps = 0;

		//Set weight of previous frames on calculation [0
		if (!this.opt.weight) {
			this.opt.weight = .5;	
		}
	}

	/**
	 * Reset fps counter
	 */
	FPS.prototype.reset = function() {
		this.last = 0;
		this.lastFps = 0;
	};

	/**
	 * Recalculate new frame
	 *
	 * @param   number   prec   Precision
	 *
	 * @return  number
	 */
	FPS.prototype.frame = function(prec) {
		var now, diff, fps

		now = Date.now();

		if (this.last === 0) {
			this.last = now;
			return 0;
		}

		diff = now - this.last;
		this.last = now;
		fps = 1000 / (diff);
		//console.log(diff);

		this.lastFps = (fps * (1 - this.opt.weight) + this.lastFps * this.opt.weight);

		return this.get(prec);
	};

	/**
	 * Get last calculation
	 *
	 * @param   number   prec   Precision
	 *
	 * @return  number
	 */
	FPS.prototype.get = function(prec) {
		var fps;

		prec = 1 / (prec || 1);

		fps = Math.round(this.lastFps * prec) / prec;

		return fps;
	};

	window.FPS = FPS;

}(window));

