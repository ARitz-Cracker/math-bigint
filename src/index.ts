export function bigIntAbs(val: bigint): bigint {
	if (val < 0n) {
		return val * -1n;
	}
	return val;
};

/**
 * Unlike bigIntLogChecked, this throws a RangeError if x is <= 0
 */
export function bigIntLog(x: bigint, base: number = Math.E): bigint {
	const result = bigIntLogChecked(x, base);
	if (result == null) {
		throw new RangeError("argument of integer logarithm must be positive");
	}
	return result;
};

/**
 * Unlike bigIntLog1pChecked, this throws a RangeError if x is <= 0
 */
export function bigIntLog1p(x: bigint): bigint {
	return bigIntLog(x + 1n)
};

/**
 * Unlike bigIntLog10Checked, this throws a RangeError if x is <= 0
 */
export function bigIntLog10(x: bigint): bigint {
	return bigIntLog(x, 10)
};

/**
 * Unlike bigIntLog2Checked, this throws a RangeError if x is <= 0
 */
export function bigIntLog2(x: bigint): bigint {
	return bigIntLog(x, 2)
};

export function bigIntLogChecked(x: bigint, base: number = Math.E): bigint | null {
	if (x <= 0n) {
		return null;
	}
	base = Math.round(base);
	if (base > 36) {
		// implementation inspired by rust's `checked_ilog` source.
		const bintBase = BigInt(base);
		let n = 0n;
		while (x >= bintBase) {
			x /= bintBase;
			n += 1n;
		}
		return n;
	}
	// FIXME: benchmark what conditions (if any) this is faster than the algorithm above
	return BigInt(x.toString(base).length - 1);
};
export function bigIntLog1pChecked(x: bigint): bigint | null {
	return bigIntLogChecked(x + 1n)
};

export function bigIntLog10Checked(x: bigint): bigint | null {
	return bigIntLogChecked(x, 10)
};

export function bigIntLog2Checked(x: bigint): bigint | null {
	return bigIntLogChecked(x, 2)
};

export function bigIntMax(...x: bigint[]) {
	let m = x[0];
	for (let i = 1, l = x.length; i < l; i += 1) {
		if (m < x[i]) {
			m = x[i];
		}
	}
	return m;
};

export function bigIntMin(...x: bigint[]) {
	let m = x[0];
	for (let i = 1, l = x.length; i < l; i += 1) {
		if (m > x[i]) {
			m = x[i];
		}
	}
	return m;
};

/**
 * Uses Math.random internally so this won't work well for random values with a range wider than 2**52
 */
export function bigIntRandom(max: bigint, min: bigint = 0n): bigint {
	return BigInt(Math.round(Math.random() * Number(max - min))) + min;
}

const U64_MAX = 2n ** 64n - 1n;
export function bigIntSecureRandomUint64(): bigint {
	if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
		return crypto.getRandomValues(new BigUint64Array(1))[0]
	}else if (typeof globalThis !== "undefined" && "require" in globalThis) {
		return (((globalThis as any).require("crypto")).randomBytes(8) as Buffer).readBigUint64LE();
	}else{
		throw new Error("Couldn't find builtin method for getting random bytes");
	}
};

/**
 * Uses a u64 internally so this won't work well for random values with a range wider than 2 ** 64
 */
export function bigIntSecureRandom(max: bigint, min: bigint = 0n): bigint {
	const range = max - min;
	return (bigIntSecureRandomUint64() * range / U64_MAX) + min;
};

export function bigIntSign(x: bigint): bigint {
	if (x === 0n) {
		return 0n;
	}
	return x > 0 ? 1n : -1n;
};
