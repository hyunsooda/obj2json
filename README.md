# obj2json
this is parser(wavefront.obj and mtl file format for blender) obj to json.

<pre><code>
          [0]     [1]           [2]          [3]      
Usage :  node obj2json.js something.obj something.mtl 
</code></pre>

If you use this parser, this parser will generate json file from part to part.
The reason which be required mtl file is to making together light information.
So this is extension version of parser marked below.

references : https://github.com/chinedufn/load-wavefront-obj
