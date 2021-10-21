const Buffer = require('buffer').Buffer;

const intSize = 4;
const zeroBuffer = Buffer.alloc(intSize); zeroBuffer.fill(0);
const chrsz = 8;

function toArray(buf, bigEndian) {
    if ((buf.length % intSize) !== 0) {
        const len = buf.length + (intSize - (buf.length % intSize));
        buf = Buffer.concat([buf, zeroBuffer], len);
    }

    const arr = [];
    const fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
    for (let i = 0; i < buf.length; i += intSize) {
        arr.push(fn.call(buf, i));
    }
    return arr;
}

function toBuffer(arr, size, bigEndian) {
    const buf = Buffer.alloc(size);
    const fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
    for (let i = 0; i < arr.length; i += 1) {
        fn.call(buf, arr[i], i * 4, true);
    }
    return buf;
}

function hash(buf, fn, hashSize, bigEndian) {
    if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
    const arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
    return toBuffer(arr, hashSize, bigEndian);
}

module.exports = { hash };
