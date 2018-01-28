module.exports = parseObj;

function Obj() {
  this.alias = undefined;
  // this.vertexPositions = [];
  this.vertices = [];
  this.vertexUVs = [];
  // this.vertexNormals = [];
  this.normals = [];
  this.vertexNormalIndices = [];
  this.vertexUVIndices = [];
  // this.vertexPositionIndices = [];
  this.indices = [];

  this.Ka = undefined;
  this.Kd = undefined;
  this.Ks = undefined;
  this.d  = undefined;
  this.Ns = undefined;
  this.illum = undefined;
}


// Map .obj vertex info line names to our returned property names
// var vertexInfoNameMap = {v: 'vertexPositions', vt: 'vertexUVs', vn: 'vertexNormals', o : 'object'};
var vertexInfoNameMap = {v: 'vertices', vt: 'vertexUVs', vn: 'normals', o : 'object'};
let currentObj;

function parseObj (wavefrontString, mtlString) {
  'use strict'

  //var parsedJSON = {vertexNormals: [], vertexUVs: [], vertexPositions: [], vertexNormalIndices: [], vertexUVIndices: [], vertexPositionIndices: []}
  const parsedJSON = [];

  var linesInWavefrontObj = wavefrontString.split('\n')

  var currentLine, currentLineTokens, vertexInfoType, i, k

  // Loop through and parse every line in our .obj file
  for (i = 0; i < linesInWavefrontObj.length; i++) {
    currentLine = linesInWavefrontObj[i]
    // Tokenize our current line
    currentLineTokens = currentLine.trim().split(/\s+/)
    // vertex position, vertex texture, or vertex normal
    vertexInfoType = vertexInfoNameMap[currentLineTokens[0]]

    if(vertexInfoType === 'object') {
      currentObj = new Obj();
      parsedJSON.push(currentObj);
    } else if (vertexInfoType) {
      for (k = 1; k < currentLineTokens.length; k++) {
        currentObj[vertexInfoType].push(parseFloat(currentLineTokens[k]));
      }
      continue
    }

    if(currentLineTokens[0] === 'usemtl') {
      parseMtl(mtlString, currentObj, currentLineTokens[1]);
      currentObj.alias = currentLineTokens[1];
    }

    if (currentLineTokens[0] === 'f') {
      // Get our 4 sets of vertex, uv, and normal indices for this face
      for (k = 1; k < 5; k++) {
        // If there is no fourth face entry then this is specifying a triangle
        // in this case we push `-1`
        // Consumers of this module should check for `-1` before expanding face data
        if (k === 4 && !currentLineTokens[4]) {
          // currentObj.vertexPositionIndices.push(-1)
          /*
          currentObj.indices.push(-1);
          currentObj.vertexUVIndices.push(-1)
          currentObj.vertexNormalIndices.push(-1)
          */
        } else {
          var indices = currentLineTokens[k].split('/')
          /*
          parsedJSON.vertexPositionIndices.push(parseInt(indices[0], 10) - 1) // We zero index
          parsedJSON.vertexUVIndices.push(parseInt(indices[1], 10) - 1) // our face indices
          parsedJSON.vertexNormalIndices.push(parseInt(indices[2], 10) - 1) // by subtracting 1
          */
          // currentObj.vertexPositionIndices.push(parseInt(indices[0], 10) - 1) // We zero index
          currentObj.indices.push(parseInt(indices[0],10) -1);
          currentObj.vertexUVIndices.push(parseInt(indices[1], 10) -1) // our face indices
          currentObj.vertexNormalIndices.push(parseInt(indices[2], 10) -1) // by subtracting 1
        }
      }
    }
  }

  return parsedJSON;
}


function parseMtl(mtlStr, obj, mtlAlias) {
  const seperatedLines = mtlStr.split('\n');
  let currentLine, currentLineTokens;
  let i;

  // Loop through and parse every line in our .obj file
  for (i = 0; i < seperatedLines.length; i++) {
    
    currentLine = seperatedLines[i];
    
    // Tokenize our current line
    currentLineTokens = currentLine.trim().split(/\s+/)
    // vertex position, vertex texture, or vertex normal
    type = currentLineTokens[0].slice(0,2);

    if ((mtlAlias === currentLineTokens[1]) || (currentLineTokens[1] === undefined && mtlAlias === 'None')) {
      currentLineTokens = seperatedLines[i+1].trim().split(/\s+/);

      while(1) {
        switch(currentLineTokens[0]) {
          case 'Ka' : obj.Ka = [currentLineTokens[1], currentLineTokens[2], currentLineTokens[3]];
          break;
          case 'Kd' : obj.Kd = [currentLineTokens[1], currentLineTokens[2], currentLineTokens[3]];
          break;
          case 'Ks' : obj.Ks = [currentLineTokens[1], currentLineTokens[2], currentLineTokens[3]];
          break;
          case 'd'  : obj.d = currentLineTokens[1];
          break;
          case 'Ns' : obj.Ns = currentLineTokens[1];
          break;
          case 'illum' : obj.illum = currentLineTokens[1];
          break;
        }
        i++;
        if(seperatedLines[i+1] !== '')
          currentLineTokens = seperatedLines[i+1].trim().split(/\s+/);
        else 
          break;
      }
      return;
    }
  }
}
















