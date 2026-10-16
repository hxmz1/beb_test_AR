import { Buffer } from 'node:buffer';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { menuCategories } from '../../src/data/menu.js';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const modelsDirectory = resolve(scriptDirectory, '../../public/models');

function getImageDimensions(image, path) {
  if (image.toString('ascii', 1, 4) === 'PNG') {
    return { width: image.readUInt32BE(16), height: image.readUInt32BE(20) };
  }

  if (image[0] !== 0xff || image[1] !== 0xd8) {
    throw new Error(`Unsupported image format for 3D preview: ${path}`);
  }

  const frameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;

  while (offset < image.length) {
    if (image[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = image[offset + 1];
    const segmentLength = image.readUInt16BE(offset + 2);

    if (frameMarkers.has(marker)) {
      return {
        height: image.readUInt16BE(offset + 5),
        width: image.readUInt16BE(offset + 7),
      };
    }

    offset += segmentLength + 2;
  }

  throw new Error(`Could not read image dimensions for 3D preview: ${path}`);
}

function createQuad(positions, normal, indices, points) {
  const start = positions.length / 3;

  for (const point of points) {
    positions.push(...point);
  }

  const normals = Array(4).fill(normal).flat();
  indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
  return normals;
}

function createPrimitive(positions, normals, uvs, indices, target) {
  while (target.length % 4 !== 0) {
    target.push(0);
  }

  const positionOffset = target.length;
  for (const value of positions) target.push(...floatBytes(value));
  const normalOffset = target.length;
  for (const value of normals) target.push(...floatBytes(value));
  const uvOffset = target.length;
  for (const value of uvs) target.push(...floatBytes(value));
  while (target.length % 4 !== 0) target.push(0);
  const indexOffset = target.length;
  for (const value of indices) {
    target.push(value & 0xff, (value >> 8) & 0xff);
  }

  return {
    accessors: [
      {
        bufferView: 0,
        byteOffset: 0,
        componentType: 5126,
        count: positions.length / 3,
        max: [Math.max(...positions.filter((_, index) => index % 3 === 0)), Math.max(...positions.filter((_, index) => index % 3 === 1)), Math.max(...positions.filter((_, index) => index % 3 === 2))],
        min: [Math.min(...positions.filter((_, index) => index % 3 === 0)), Math.min(...positions.filter((_, index) => index % 3 === 1)), Math.min(...positions.filter((_, index) => index % 3 === 2))],
        type: 'VEC3',
      },
      {
        bufferView: 1,
        byteOffset: 0,
        componentType: 5126,
        count: normals.length / 3,
        type: 'VEC3',
      },
      {
        bufferView: 2,
        byteOffset: 0,
        componentType: 5126,
        count: uvs.length / 2,
        type: 'VEC2',
      },
      {
        bufferView: 3,
        byteOffset: 0,
        componentType: 5123,
        count: indices.length,
        type: 'SCALAR',
      },
    ],
    byteOffsets: [positionOffset, normalOffset, uvOffset, indexOffset],
    byteLengths: [positions.length * 4, normals.length * 4, uvs.length * 4, indices.length * 2],
    indices: indices.length,
  };
}

function floatBytes(value) {
  const buffer = Buffer.allocUnsafe(4);
  buffer.writeFloatLE(value);
  return buffer;
}

function createModel(imagePath, width, height) {
  const depth = 0.08;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const halfDepth = depth / 2;

  const frontPositions = [
    -halfWidth, -halfHeight, halfDepth,
    halfWidth, -halfHeight, halfDepth,
    halfWidth, halfHeight, halfDepth,
    -halfWidth, halfHeight, halfDepth,
  ];
  const frontNormals = Array(4).fill([0, 0, 1]).flat();
  const frontUvs = [0, 0, 1, 0, 1, 1, 0, 1];
  const frontIndices = [0, 1, 2, 0, 2, 3];

  const bodyPositions = [];
  const bodyNormals = [];
  const bodyUvs = [];
  const bodyIndices = [];
  const faces = [
    { normal: [0, 0, -1], points: [[halfWidth, -halfHeight, -halfDepth], [-halfWidth, -halfHeight, -halfDepth], [-halfWidth, halfHeight, -halfDepth], [halfWidth, halfHeight, -halfDepth]] },
    { normal: [-1, 0, 0], points: [[-halfWidth, -halfHeight, halfDepth], [-halfWidth, halfHeight, halfDepth], [-halfWidth, halfHeight, -halfDepth], [-halfWidth, -halfHeight, -halfDepth]] },
    { normal: [1, 0, 0], points: [[halfWidth, -halfHeight, halfDepth], [halfWidth, -halfHeight, -halfDepth], [halfWidth, halfHeight, -halfDepth], [halfWidth, halfHeight, halfDepth]] },
    { normal: [0, 1, 0], points: [[-halfWidth, halfHeight, halfDepth], [halfWidth, halfHeight, halfDepth], [halfWidth, halfHeight, -halfDepth], [-halfWidth, halfHeight, -halfDepth]] },
    { normal: [0, -1, 0], points: [[-halfWidth, -halfHeight, halfDepth], [-halfWidth, -halfHeight, -halfDepth], [halfWidth, -halfHeight, -halfDepth], [halfWidth, -halfHeight, halfDepth]] },
  ];

  for (const face of faces) {
    bodyNormals.push(...createQuad(bodyPositions, face.normal, bodyIndices, face.points));
    bodyUvs.push(0, 0, 1, 0, 1, 1, 0, 1);
  }

  const binary = [];
  const front = createPrimitive(frontPositions, frontNormals, frontUvs, frontIndices, binary);
  const body = createPrimitive(bodyPositions, bodyNormals, bodyUvs, bodyIndices, binary);
  const binaryBuffer = Buffer.from(binary);

  const accessors = [];
  const bufferViews = [];
  for (const primitive of [front, body]) {
    const accessorStart = accessors.length;
    const viewStart = bufferViews.length;

    for (let index = 0; index < primitive.accessors.length; index += 1) {
      const accessor = primitive.accessors[index];
      const viewIndex = bufferViews.length;
      bufferViews.push({
        buffer: 0,
        byteOffset: primitive.byteOffsets[index],
        byteLength: primitive.byteLengths[index],
        target: index === 3 ? 34963 : 34962,
      });
      accessors.push({ ...accessor, bufferView: viewIndex });
    }

    primitive.attributes = { POSITION: accessorStart, NORMAL: accessorStart + 1, TEXCOORD_0: accessorStart + 2 };
    primitive.indexAccessor = accessorStart + 3;
    primitive.materialIndex = viewStart === 0 ? 0 : 1;
  }

  return {
    asset: { version: '2.0', generator: 'restaurant-menu 3D preview generator' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{
      primitives: [front, body].map((primitive) => ({
        attributes: primitive.attributes,
        indices: primitive.indexAccessor,
        material: primitive.materialIndex,
        mode: 4,
      })),
    }],
    materials: [
      {
        pbrMetallicRoughness: {
          baseColorTexture: { index: 0 },
          metallicFactor: 0,
          roughnessFactor: 1,
        },
        doubleSided: true,
      },
      {
        pbrMetallicRoughness: {
          baseColorFactor: [0.28, 0.2, 0.16, 1],
          metallicFactor: 0,
          roughnessFactor: 1,
        },
        doubleSided: true,
      },
    ],
    textures: [{ sampler: 0, source: 0 }],
    samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }],
    images: [{ uri: imagePath }],
    bufferViews,
    accessors,
    buffers: [{ byteLength: binaryBuffer.length, uri: `data:application/octet-stream;base64,${binaryBuffer.toString('base64')}` }],
  };
}

await mkdir(modelsDirectory, { recursive: true });

for (const category of menuCategories) {
  const imagePath = resolve(scriptDirectory, `../../public${category.image}`);
  const image = await readFile(imagePath);
  const { width: imageWidth, height: imageHeight } = getImageDimensions(image, category.image);
  const model = createModel(category.image, 1.8, 1.8 * imageHeight / imageWidth);
  const outputPath = resolve(modelsDirectory, `${category.id}.gltf`);

  await writeFile(outputPath, `${JSON.stringify(model)}\n`);
  console.log(`Generated ${outputPath}`);
}
