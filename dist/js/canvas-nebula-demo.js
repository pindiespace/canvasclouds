//////////////////////////////////////////////////////////////////////////////////
// A demonstration of a Canvas nebula effect
// (c) 2010 by R Cecco. <http://www.professorcloud.com>
// MIT License
//
// Please retain this copyright header in all versions of the software if
// using significant parts of it
//////////////////////////////////////////////////////////////////////////////////

/** 
 * 1. Create an image, e.g. 570 x 570 pixels you want to blend
 * 2. Set up canvas sizes
 *    - canvas1 285x285
 *    - canvas2 570x570
 *    - canvas3 570x570
 * 3. Hide canvas1 and canvas3, display canvas2
 * 
 * @link http://www.professorcloud.com/mainsite/canvas-nebula.htm
 * 
 * This is a simple demonstration of a nebula effect using the HTML5 Canvas element. 
 * The effect is created by layering three images, derived from a larger single bitmap source, 
 * that fade in and out while increasing in scale. The non-repeating nature of the effect is 
 * created by having a larger bitmap than the view area and choosing a random texture offset.
 */

$(document).ready(function(){	
													   
	(function ($) {	

			//get default sizes

			var canvasSize = 570;
			var halfSize = 285;

			// The canvas element we are drawing into.      
			var	$canvas1 = $('#canvas1');
			$canvas1.width = halfSize;
			$canvas1.height = halfSize;

			var	$canvas2 = $('#canvas2');
			$canvas2.width = canvasSize;
			$canvas2.height = canvasSize;

			var	$canvas3 = $('#canvas3');
			$canvas3.width = canvasSize;
			$canvas3.height = canvasSize;


			// get drawing context	
			var	ctx2 = $canvas2[0].getContext('2d');
			var	ctx = $canvas1[0].getContext('2d');

			// half-sized canvas

			var	w = $canvas1[0].width, h = $canvas1[0].height;	

			var	img = new Image();	
			
			// A puff.
			var	Puff = function(p) {				
				var	opacity,
					sy = (Math.random()*halfSize)>>0,
					sx = (Math.random()*halfSize)>>0;
				
				this.p = p;
						
				this.move = function(timeFac) {						
					p = this.p + 0.3 * timeFac;				
					opacity = (Math.sin(p*0.05)*0.5);						
					if(opacity <0) {
						p = opacity = 0;
						sy = (Math.random()*halfSize)>>0;
						sx = (Math.random()*halfSize)>>0;
					}												
					this.p = p;																			
					ctx.globalAlpha = opacity;						
					ctx.drawImage($canvas3[0], sy+p, sy+p, halfSize-(p*2),halfSize-(p*2), 0,0, w, h);								
				};
			};
			
			var	puffs = [];			
			var	sortPuff = function(p1,p2) { return p1.p-p2.p; };	
			puffs.push( new Puff(0) );
			puffs.push( new Puff(20) );
			puffs.push( new Puff(40) );
			
			var	newTime, oldTime = 0, timeFac;
					
			var	loop = function()
			{
				newTime = new Date().getTime();				
				if(oldTime === 0 ) {
					oldTime=newTime;
				}
				timeFac = (newTime-oldTime) * 0.1;
				if(timeFac>3) {timeFac=3;}
				oldTime = newTime;						
				puffs.sort(sortPuff);							
				
				for(var i=0;i<puffs.length;i++)
				{
					puffs[i].move(timeFac);	
				}					
				ctx2.drawImage( $canvas1[0] ,0,0,canvasSize,canvasSize);				
				setTimeout(loop, 40 );				
			};

			// Turns out Chrome is much faster doing bitmap work if the bitmap is in an existing canvas rather
			// than an IMG, VIDEO etc. So draw the big nebula image into canvas3

			var	$canvas3 = $('#canvas3');
			var	ctx3 = $canvas3[0].getContext('2d');
			$(img).bind('load',null, function() {  ctx3.drawImage(img, 0,0, canvasSize, canvasSize);	loop(); });
			img.src = 'img/bkgnds/nebula.jpg';
		
	})(jQuery);	 
});

