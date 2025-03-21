/**
 * potpack - by [@mourner](https://github.com/mourner)
 * 
 * A tiny JavaScript function for packing 2D rectangles into a near-square container, 
 * which is useful for generating CSS sprites and WebGL textures. Similar to 
 * [shelf-pack](https://github.com/mapbox/shelf-pack), but static (you can't add items 
 * once a layout is generated), and aims for maximal space utilization.
 *
 * A variation of algorithms used in [rectpack2D](https://github.com/TeamHypersomnia/rectpack2D)
 * and [bin-pack](https://github.com/bryanburgers/bin-pack), which are in turn based 
 * on [this article by Blackpawn](http://blackpawn.com/texts/lightmaps/default.html).
 * 
 * @license
 * ISC License
 * 
 * Copyright (c) 2018, Mapbox
 * 
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
 * THIS SOFTWARE.
 */ function potpack(h){let w=0,t=0;for(let e of h)w+=e.w*e.h,t=Math.max(t,e.w);h.sort((h,w)=>w.h-h.h);let l=[{x:0,y:0,w:Math.max(Math.ceil(Math.sqrt(w/.95)),t),h:1/0}],x=0,o=0;for(let f of h)for(let r=l.length-1;r>=0;r--){let $=l[r];if(!(f.w>$.w)&&!(f.h>$.h)){if(f.x=$.x,f.y=$.y,o=Math.max(o,f.y+f.h),x=Math.max(x,f.x+f.w),f.w===$.w&&f.h===$.h){let p=l.pop();r<l.length&&(l[r]=p)}else f.h===$.h?($.x+=f.w,$.w-=f.w):f.w===$.w?($.y+=f.h,$.h-=f.h):(l.push({x:$.x+f.w,y:$.y,w:$.w-f.w,h:f.h}),$.y+=f.h,$.h-=f.h);break}}return{w:x,h:o,fill:w/(x*o)||0}}export{potpack};