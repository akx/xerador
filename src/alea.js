// Based on https://raw.githubusercontent.com/davidbau/seedrandom/released/lib/alea.js
// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


function Alea(seed) {
    const self = this, mash = Mash();

    self.next = function () {
        var t = 2091639 * self.s0 + self.c * 2.3283064365386963e-10; // 2^-32
        self.s0 = self.s1;
        self.s1 = self.s2;
        return self.s2 = t - (self.c = t | 0);
    };

    // Apply the seeding algorithm from Baagoe.
    self.c = 1;
    self.s0 = mash(" ");
    self.s1 = mash(" ");
    self.s2 = mash(" ");
    self.s0 -= mash(seed);
    if (self.s0 < 0) {
        self.s0 += 1;
    }
    self.s1 -= mash(seed);
    if (self.s1 < 0) {
        self.s1 += 1;
    }
    self.s2 -= mash(seed);
    if (self.s2 < 0) {
        self.s2 += 1;
    }
}

function copy(f, t) {
    t.c = f.c;
    t.s0 = f.s0;
    t.s1 = f.s1;
    t.s2 = f.s2;
    return t;
}

function impl(seed, opts) {
    const xg = new Alea(seed),
        state = opts && opts.state,
        prng = xg.next;
    prng.int32 = function () {
        return (xg.next() * 0x100000000) | 0;
    };
    prng.double = function () {
        return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    };
    prng.quick = prng;
    if (state) {
        if (typeof (state) == "object") copy(state, xg);
        prng.state = function () {
            return copy(xg, {});
        };
    }
    return prng;
}

function Mash() {
    var n = 0xefc8249d;

    var mash = function (data) {
        data = data.toString();
        for (var i = 0; i < data.length; i++) {
            n += data.charCodeAt(i);
            var h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000; // 2^32
        }
        return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    return mash;
}

module.exports = impl;
