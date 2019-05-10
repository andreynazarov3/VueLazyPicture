(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.LazyPicture = {}));
}(this, function (exports) { 'use strict';

    /**
    * StackBlur - a fast almost Gaussian Blur For Canvas
    *
    * In case you find this class useful - especially in commercial projects -
    * I am not totally unhappy for a small donation to my PayPal account
    * mario@quasimondo.de
    *
    * Or support me on flattr:
    * {@link https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript}
    * @module StackBlur
    * @version 0.5
    * @author Mario Klingemann
    * Contact: mario@quasimondo.com
    * Website: {@link http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html}
    * Twitter: @quasimondo
    *
    * @copyright (c) 2010 Mario Klingemann
    *
    * Permission is hereby granted, free of charge, to any person
    * obtaining a copy of this software and associated documentation
    * files (the "Software"), to deal in the Software without
    * restriction, including without limitation the rights to use,
    * copy, modify, merge, publish, distribute, sublicense, and/or sell
    * copies of the Software, and to permit persons to whom the
    * Software is furnished to do so, subject to the following
    * conditions:
    *
    * The above copyright notice and this permission notice shall be
    * included in all copies or substantial portions of the Software.
    *
    * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    * OTHER DEALINGS IN THE SOFTWARE.
    */

    var mulTable = [
        512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512,
        454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512,
        482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456,
        437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512,
        497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328,
        320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
        446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335,
        329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512,
        505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405,
        399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328,
        324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271,
        268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456,
        451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
        385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335,
        332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
        289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];

    var shgTable = [
        9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
        17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
        19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];

    /**
     * @param {string|HTMLImageElement} img
     * @param {string|HTMLCanvasElement} canvas
     * @param {Float} radius
     * @param {boolean} blurAlphaChannel
     * @returns {undefined}
     */
    function processImage (img, canvas, radius, blurAlphaChannel) {
        if (typeof img === 'string') {
            img = document.getElementById(img);
        }
        if (!img || !('naturalWidth' in img)) {
            return;
        }
        var w = img.naturalWidth;
        var h = img.naturalHeight;

        if (typeof canvas === 'string') {
            canvas = document.getElementById(canvas);
        }
        if (!canvas || !('getContext' in canvas)) {
            return;
        }

        canvas.width = w;
        canvas.height = h;

        var context = canvas.getContext('2d');
        context.clearRect(0, 0, w, h);
        context.drawImage(img, 0, 0);

        if (isNaN(radius) || radius < 1) { return; }

        if (blurAlphaChannel) {
            processCanvasRGBA(canvas, 0, 0, w, h, radius);
        } else {
            processCanvasRGB(canvas, 0, 0, w, h, radius);
        }
    }

    /**
     * @param {string|HTMLCanvasElement} canvas
     * @param {Integer} topX
     * @param {Integer} topY
     * @param {Integer} width
     * @param {Integer} height
     * @throws {Error|TypeError}
     * @returns {ImageData} See {@link https://html.spec.whatwg.org/multipage/canvas.html#imagedata}
     */
    function getImageDataFromCanvas (canvas, topX, topY, width, height) {
        if (typeof canvas === 'string') {
            canvas = document.getElementById(canvas);
        }
        if (!canvas || typeof canvas !== 'object' || !('getContext' in canvas)) {
            throw new TypeError('Expecting canvas with `getContext` method in processCanvasRGB(A) calls!');
        }

        var context = canvas.getContext('2d');

        try {
            return context.getImageData(topX, topY, width, height);
        } catch (e) {
            throw new Error('unable to access image data: ' + e);
        }
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Integer} topX
     * @param {Integer} topY
     * @param {Integer} width
     * @param {Integer} height
     * @param {Float} radius
     * @returns {undefined}
     */
    function processCanvasRGBA (canvas, topX, topY, width, height, radius) {
        if (isNaN(radius) || radius < 1) { return; }
        radius |= 0;

        var imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);

        imageData = processImageDataRGBA(imageData, topX, topY, width, height, radius);

        canvas.getContext('2d').putImageData(imageData, topX, topY);
    }

    /**
     * @param {ImageData} imageData
     * @param {Integer} topX
     * @param {Integer} topY
     * @param {Integer} width
     * @param {Integer} height
     * @param {Float} radius
     * @returns {ImageData}
     */
    function processImageDataRGBA (imageData, topX, topY, width, height, radius) {
        var pixels = imageData.data;

        var x, y, i, p, yp, yi, yw, rSum, gSum, bSum, aSum,
            rOutSum, gOutSum, bOutSum, aOutSum,
            rInSum, gInSum, bInSum, aInSum,
            pr, pg, pb, pa, rbs;

        var div = 2 * radius + 1;
        // const w4 = width << 2;
        var widthMinus1 = width - 1;
        var heightMinus1 = height - 1;
        var radiusPlus1 = radius + 1;
        var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

        var stackStart = new BlurStack();
        var stack = stackStart;
        var stackEnd;
        for (i = 1; i < div; i++) {
            stack = stack.next = new BlurStack();
            if (i === radiusPlus1) {
                stackEnd = stack;
            }
        }
        stack.next = stackStart;
        var stackIn = null;
        var stackOut = null;

        yw = yi = 0;

        var mulSum = mulTable[radius];
        var shgSum = shgTable[radius];

        for (y = 0; y < height; y++) {
            rInSum = gInSum = bInSum = aInSum = rSum = gSum = bSum = aSum = 0;

            rOutSum = radiusPlus1 * (pr = pixels[yi]);
            gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
            bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
            aOutSum = radiusPlus1 * (pa = pixels[yi + 3]);

            rSum += sumFactor * pr;
            gSum += sumFactor * pg;
            bSum += sumFactor * pb;
            aSum += sumFactor * pa;

            stack = stackStart;

            for (i = 0; i < radiusPlus1; i++) {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }

            for (i = 1; i < radiusPlus1; i++) {
                p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
                rSum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
                gSum += (stack.g = (pg = pixels[p + 1])) * rbs;
                bSum += (stack.b = (pb = pixels[p + 2])) * rbs;
                aSum += (stack.a = (pa = pixels[p + 3])) * rbs;

                rInSum += pr;
                gInSum += pg;
                bInSum += pb;
                aInSum += pa;

                stack = stack.next;
            }

            stackIn = stackStart;
            stackOut = stackEnd;
            for (x = 0; x < width; x++) {
                pixels[yi + 3] = pa = (aSum * mulSum) >> shgSum;
                if (pa !== 0) {
                    pa = 255 / pa;
                    pixels[yi] = ((rSum * mulSum) >> shgSum) * pa;
                    pixels[yi + 1] = ((gSum * mulSum) >> shgSum) * pa;
                    pixels[yi + 2] = ((bSum * mulSum) >> shgSum) * pa;
                } else {
                    pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
                }

                rSum -= rOutSum;
                gSum -= gOutSum;
                bSum -= bOutSum;
                aSum -= aOutSum;

                rOutSum -= stackIn.r;
                gOutSum -= stackIn.g;
                bOutSum -= stackIn.b;
                aOutSum -= stackIn.a;

                p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

                rInSum += (stackIn.r = pixels[p]);
                gInSum += (stackIn.g = pixels[p + 1]);
                bInSum += (stackIn.b = pixels[p + 2]);
                aInSum += (stackIn.a = pixels[p + 3]);

                rSum += rInSum;
                gSum += gInSum;
                bSum += bInSum;
                aSum += aInSum;

                stackIn = stackIn.next;

                rOutSum += (pr = stackOut.r);
                gOutSum += (pg = stackOut.g);
                bOutSum += (pb = stackOut.b);
                aOutSum += (pa = stackOut.a);

                rInSum -= pr;
                gInSum -= pg;
                bInSum -= pb;
                aInSum -= pa;

                stackOut = stackOut.next;

                yi += 4;
            }
            yw += width;
        }

        for (x = 0; x < width; x++) {
            gInSum = bInSum = aInSum = rInSum = gSum = bSum = aSum = rSum = 0;

            yi = x << 2;
            rOutSum = radiusPlus1 * (pr = pixels[yi]);
            gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
            bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
            aOutSum = radiusPlus1 * (pa = pixels[yi + 3]);

            rSum += sumFactor * pr;
            gSum += sumFactor * pg;
            bSum += sumFactor * pb;
            aSum += sumFactor * pa;

            stack = stackStart;

            for (i = 0; i < radiusPlus1; i++) {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }

            yp = width;

            for (i = 1; i <= radius; i++) {
                yi = (yp + x) << 2;

                rSum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
                gSum += (stack.g = (pg = pixels[yi + 1])) * rbs;
                bSum += (stack.b = (pb = pixels[yi + 2])) * rbs;
                aSum += (stack.a = (pa = pixels[yi + 3])) * rbs;

                rInSum += pr;
                gInSum += pg;
                bInSum += pb;
                aInSum += pa;

                stack = stack.next;

                if (i < heightMinus1) {
                    yp += width;
                }
            }

            yi = x;
            stackIn = stackStart;
            stackOut = stackEnd;
            for (y = 0; y < height; y++) {
                p = yi << 2;
                pixels[p + 3] = pa = (aSum * mulSum) >> shgSum;
                if (pa > 0) {
                    pa = 255 / pa;
                    pixels[p] = ((rSum * mulSum) >> shgSum) * pa;
                    pixels[p + 1] = ((gSum * mulSum) >> shgSum) * pa;
                    pixels[p + 2] = ((bSum * mulSum) >> shgSum) * pa;
                } else {
                    pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
                }

                rSum -= rOutSum;
                gSum -= gOutSum;
                bSum -= bOutSum;
                aSum -= aOutSum;

                rOutSum -= stackIn.r;
                gOutSum -= stackIn.g;
                bOutSum -= stackIn.b;
                aOutSum -= stackIn.a;

                p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;

                rSum += (rInSum += (stackIn.r = pixels[p]));
                gSum += (gInSum += (stackIn.g = pixels[p + 1]));
                bSum += (bInSum += (stackIn.b = pixels[p + 2]));
                aSum += (aInSum += (stackIn.a = pixels[p + 3]));

                stackIn = stackIn.next;

                rOutSum += (pr = stackOut.r);
                gOutSum += (pg = stackOut.g);
                bOutSum += (pb = stackOut.b);
                aOutSum += (pa = stackOut.a);

                rInSum -= pr;
                gInSum -= pg;
                bInSum -= pb;
                aInSum -= pa;

                stackOut = stackOut.next;

                yi += width;
            }
        }
        return imageData;
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Integer} topX
     * @param {Integer} topY
     * @param {Integer} width
     * @param {Integer} height
     * @param {Float} radius
     * @returns {undefined}
     */
    function processCanvasRGB (canvas, topX, topY, width, height, radius) {
        if (isNaN(radius) || radius < 1) { return; }
        radius |= 0;

        var imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);
        imageData = processImageDataRGB(imageData, topX, topY, width, height, radius);

        canvas.getContext('2d').putImageData(imageData, topX, topY);
    }

    /**
     * @param {ImageData} imageData
     * @param {Integer} topX
     * @param {Integer} topY
     * @param {Integer} width
     * @param {Integer} height
     * @param {Float} radius
     * @returns {ImageData}
     */
    function processImageDataRGB (imageData, topX, topY, width, height, radius) {
        var pixels = imageData.data;

        var x, y, i, p, yp, yi, yw, rSum, gSum, bSum,
            rOutSum, gOutSum, bOutSum,
            rInSum, gInSum, bInSum,
            pr, pg, pb, rbs;

        var div = 2 * radius + 1;
        // const w4 = width << 2;
        var widthMinus1 = width - 1;
        var heightMinus1 = height - 1;
        var radiusPlus1 = radius + 1;
        var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

        var stackStart = new BlurStack();
        var stack = stackStart;
        var stackEnd;
        for (i = 1; i < div; i++) {
            stack = stack.next = new BlurStack();
            if (i === radiusPlus1) {
                stackEnd = stack;
            }
        }
        stack.next = stackStart;
        var stackIn = null;
        var stackOut = null;

        yw = yi = 0;

        var mulSum = mulTable[radius];
        var shgSum = shgTable[radius];

        for (y = 0; y < height; y++) {
            rInSum = gInSum = bInSum = rSum = gSum = bSum = 0;

            rOutSum = radiusPlus1 * (pr = pixels[yi]);
            gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
            bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);

            rSum += sumFactor * pr;
            gSum += sumFactor * pg;
            bSum += sumFactor * pb;

            stack = stackStart;

            for (i = 0; i < radiusPlus1; i++) {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack = stack.next;
            }

            for (i = 1; i < radiusPlus1; i++) {
                p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
                rSum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
                gSum += (stack.g = (pg = pixels[p + 1])) * rbs;
                bSum += (stack.b = (pb = pixels[p + 2])) * rbs;

                rInSum += pr;
                gInSum += pg;
                bInSum += pb;

                stack = stack.next;
            }

            stackIn = stackStart;
            stackOut = stackEnd;
            for (x = 0; x < width; x++) {
                pixels[yi] = (rSum * mulSum) >> shgSum;
                pixels[yi + 1] = (gSum * mulSum) >> shgSum;
                pixels[yi + 2] = (bSum * mulSum) >> shgSum;

                rSum -= rOutSum;
                gSum -= gOutSum;
                bSum -= bOutSum;

                rOutSum -= stackIn.r;
                gOutSum -= stackIn.g;
                bOutSum -= stackIn.b;

                p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

                rInSum += (stackIn.r = pixels[p]);
                gInSum += (stackIn.g = pixels[p + 1]);
                bInSum += (stackIn.b = pixels[p + 2]);

                rSum += rInSum;
                gSum += gInSum;
                bSum += bInSum;

                stackIn = stackIn.next;

                rOutSum += (pr = stackOut.r);
                gOutSum += (pg = stackOut.g);
                bOutSum += (pb = stackOut.b);

                rInSum -= pr;
                gInSum -= pg;
                bInSum -= pb;

                stackOut = stackOut.next;

                yi += 4;
            }
            yw += width;
        }

        for (x = 0; x < width; x++) {
            gInSum = bInSum = rInSum = gSum = bSum = rSum = 0;

            yi = x << 2;
            rOutSum = radiusPlus1 * (pr = pixels[yi]);
            gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
            bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);

            rSum += sumFactor * pr;
            gSum += sumFactor * pg;
            bSum += sumFactor * pb;

            stack = stackStart;

            for (i = 0; i < radiusPlus1; i++) {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack = stack.next;
            }

            yp = width;

            for (i = 1; i <= radius; i++) {
                yi = (yp + x) << 2;

                rSum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
                gSum += (stack.g = (pg = pixels[yi + 1])) * rbs;
                bSum += (stack.b = (pb = pixels[yi + 2])) * rbs;

                rInSum += pr;
                gInSum += pg;
                bInSum += pb;

                stack = stack.next;

                if (i < heightMinus1) {
                    yp += width;
                }
            }

            yi = x;
            stackIn = stackStart;
            stackOut = stackEnd;
            for (y = 0; y < height; y++) {
                p = yi << 2;
                pixels[p] = (rSum * mulSum) >> shgSum;
                pixels[p + 1] = (gSum * mulSum) >> shgSum;
                pixels[p + 2] = (bSum * mulSum) >> shgSum;

                rSum -= rOutSum;
                gSum -= gOutSum;
                bSum -= bOutSum;

                rOutSum -= stackIn.r;
                gOutSum -= stackIn.g;
                bOutSum -= stackIn.b;

                p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;

                rSum += (rInSum += (stackIn.r = pixels[p]));
                gSum += (gInSum += (stackIn.g = pixels[p + 1]));
                bSum += (bInSum += (stackIn.b = pixels[p + 2]));

                stackIn = stackIn.next;

                rOutSum += (pr = stackOut.r);
                gOutSum += (pg = stackOut.g);
                bOutSum += (pb = stackOut.b);

                rInSum -= pr;
                gInSum -= pg;
                bInSum -= pb;

                stackOut = stackOut.next;

                yi += width;
            }
        }

        return imageData;
    }

    /**
     *
     */
    var BlurStack = function BlurStack () {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 0;
        this.next = null;
    };

    //
    if (process.browser) {
    	require("intersection-observer");
    }
    var script = {
    	props: {
    		maxWidth: {
    			type: String,
    			default: "100%"
    		},
    		containerClass: {
    			type: String,
    			default: "lazy-picture"
    		},
    		title: {
    			type: String,
    			default: "Image"
    		},
    		placeholder: {
    			type: String,
    			required: true
    		},
    		src: {
    			type: String,
    			required: true
    		},
    		lazy: {
    			type: Boolean,
    			default: false
    		},
    		blurRadius: {
    			type: Number,
    			default: 5
    		},
    		transitionDuration: {
    			type: Number,
    			default: 2000
    		},
    		easing: {
    			type: String,
    			default: "ease"
    		}
    	},
    	data: function data() {
    		return {
    			loaded: false,
    			observer: null,
    			intersected: false,
    			intersectionOptions: {
    				root: null,
    				rootMargin: "0px 0px 0px 0px",
    				threshold: 0
    			},
    			canvasStyle: {
    				position: "absolute",
    				top: 0,
    				left: 0,
    				width: "100%"
    			},
    			fullsizeImageStyleDefaults: {
    				position: "absolute",
    				top: 0,
    				left: 0,
    				width: "100%"
    			},
    			placeholderStyle: {
    				display: "block",
    				width: "100%",
    				opacity: 0
    			}
    		};
    	},
    	computed: {
    		getFullSizeImageStyle: function getFullSizeImageStyle() {
    			return Object.assign({}, this.fullsizeImageStyleDefaults,
    				{opacity: this.loaded ? 1 : 0,
    				transitionDuration: ((this.transitionDuration) + "ms"),
    				transitionTimingFunction: ("" + (this.easing))});
    		},
    		getFullSizeSrc: function getFullSizeSrc() {
    			if (!this.lazy) {
    				return this.src;
    			}
    			if (this.lazy && this.intersected) {
    				return this.src;
    			}
    			return null;
    		}
    	},
    	methods: {
    		onPlaceholderLoad: function onPlaceholderLoad() {
    			if (this.lazy) {
    				this.createIntersectionObserver();
    				this.createBlurredImage();
    			}
    		},
    		createBlurredImage: function createBlurredImage() {
    			return processImage(
    				this.$refs.placeholder,
    				this.$refs.canvas,
    				this.blurRadius,
    				false
    			);
    		},
    		createIntersectionObserver: function createIntersectionObserver() {
    			var this$1 = this;

    			this.observer = new IntersectionObserver(function (entries) {
    				var image = entries[0];
    				if (image.isIntersecting) {
    					this$1.intersected = true;
    					this$1.observer.disconnect();
    				}
    			}, this.intersectionOptions);
    			this.observer.observe(this.$el);
    		}
    	},
    	beforeDestroy: function beforeDestroy() {
    		this.observer.disconnect();
    	}
    };

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
    /* server only */
    , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
      } // Vue.extend constructor export interop.


      var options = typeof script === 'function' ? script.options : script; // render functions

      if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true; // functional template

        if (isFunctionalTemplate) {
          options.functional = true;
        }
      } // scopedId


      if (scopeId) {
        options._scopeId = scopeId;
      }

      var hook;

      if (moduleIdentifier) {
        // server build
        hook = function hook(context) {
          // 2.3 injection
          context = context || // cached call
          this.$vnode && this.$vnode.ssrContext || // stateful
          this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
          // 2.2 with runInNewContext: true

          if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
            context = __VUE_SSR_CONTEXT__;
          } // inject component styles


          if (style) {
            style.call(this, createInjectorSSR(context));
          } // register component module identifier for async chunk inference


          if (context && context._registeredComponents) {
            context._registeredComponents.add(moduleIdentifier);
          }
        }; // used by ssr in case component is cached and beforeCreate
        // never gets called


        options._ssrRegister = hook;
      } else if (style) {
        hook = shadowMode ? function () {
          style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
        } : function (context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook) {
        if (options.functional) {
          // register for functional component in vue file
          var originalRender = options.render;

          options.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context);
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = options.beforeCreate;
          options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }

      return script;
    }

    var normalizeComponent_1 = normalizeComponent;

    /* script */
    var __vue_script__ = script;

    /* template */
    var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"container",class:[_vm.containerClass],style:({ position: 'relative', maxWidth: _vm.maxWidth })},[_c('img',{ref:"placeholder",style:(_vm.placeholderStyle),attrs:{"src":_vm.placeholder},on:{"load":_vm.onPlaceholderLoad}}),_vm._v(" "),_c('canvas',{ref:"canvas",style:(_vm.canvasStyle)}),_vm._v(" "),_c('img',{ref:"picture",style:(_vm.getFullSizeImageStyle),attrs:{"alt":_vm.title,"src":_vm.getFullSizeSrc},on:{"load":function($event){_vm.loaded = true;}}})])};
    var __vue_staticRenderFns__ = [];

      /* style */
      var __vue_inject_styles__ = undefined;
      /* scoped */
      var __vue_scope_id__ = undefined;
      /* module identifier */
      var __vue_module_identifier__ = undefined;
      /* functional template */
      var __vue_is_functional_template__ = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var component = normalizeComponent_1(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        undefined,
        undefined
      );

    // Import vue component

    // install function executed by Vue.use()
    function install(Vue) {
      if (install.installed) { return; }
      install.installed = true;
      Vue.component('LazyPicture', component);
    }

    // Create module definition for Vue.use()
    var plugin = {
      install: install,
    };

    // To auto-install when vue is found
    /* global window global */
    var GlobalVue = null;
    if (typeof window !== 'undefined') {
      GlobalVue = window.Vue;
    } else if (typeof global !== 'undefined') {
      GlobalVue = global.Vue;
    }
    if (GlobalVue) {
      GlobalVue.use(plugin);
    }

    // Inject install function into component - allows component
    // to be registered via Vue.use() as well as Vue.component()
    component.install = install;

    // It's possible to expose named exports when writing components that can
    // also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
    // export const RollupDemoDirective = component;

    exports.default = component;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
