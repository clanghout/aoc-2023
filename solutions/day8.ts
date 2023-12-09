import {assertEquals} from "https://deno.land/std@0.208.0/assert/assert_equals.ts";
import {assertNotEquals} from "https://deno.land/std@0.208.0/assert/assert_not_equals.ts";

const test: Input = [`RL`, `AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`]

const test2: Input = [`LLR`,
    `AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`]

const input: Input = (await Deno.readTextFile("inputs/input8.txt")).split('\n\n') as Input;

type Input = [sequence: string, input: string];
type Mapping = Record<string, [string, string]>;

function parseInput(input: Input) {
    const sequence = input[0].split('')
    const mapping = input[1]
        .split('\n')
        .filter(l => l.length > 0)
        .map(line => [...line.match(/([A-Z0-9]{3}) = \(([A-Z0-9]{3}), ([A-Z0-9]{3})\)/)!])
        .filter(l => l && (l.length === 4))
        .reduce((acc: Mapping, curr) => {
            const [_, match1, left, right] = curr;
            acc[match1] = [left, right];
            return acc;
        }, {} as Mapping)
    return {sequence, mapping};
}

const part1 = (input: Input): number => {
    const {sequence, mapping} = parseInput(input);

    let curSpot = 'AAA'
    let curIndex = 0;
    let res = 0;

    while (curSpot !== 'ZZZ') {
        curIndex = (res) % sequence.length
        const direction = sequence[curIndex]
        curSpot = direction === 'L' ? mapping[curSpot][0] : mapping[curSpot][1]

        res++

        // console.log(`loop ${res}; index = ${curIndex}; direction = ${direction}; spot = ${curSpot}`)
    }
    return res;
}


const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541]

function getPrimes(i: number): number[] {
    let rest = i;
    let ind = 0;
    const res: number[] = [];
    do {
        let prime = primes[ind];
        if (rest % prime === 0) {
            rest = rest / prime
            res.push(prime)
            ind = 0
        } else {
            ind++
            if (ind >= 100) {
                console.log('we failed', rest)
                return res;
            }
        }
    } while (rest > 1)
    return res;
}

const part2 = (input: Input): number => {
    const {sequence, mapping} = parseInput(input);
    const positions = Object.keys(mapping).filter(m => m.endsWith('A'));


    const finishIndexes = positions.map(spot => {
        let curSpot = spot
        let curIndex = 0;
        let res = 0;

        while (!curSpot.endsWith('Z')) {
            curIndex = (res) % sequence.length
            const direction = sequence[curIndex]
            curSpot = direction === 'L' ? mapping[curSpot][0] : mapping[curSpot][1]
            res++

            // console.log(`loop ${res}; index = ${curIndex}; direction = ${direction}; spot = ${curSpot}`)
        }
        console.log(`finished for ${spot} with ${curSpot} in ${res} steps`)
        return res;
    });

    // find lowest common multiplier
    let map = [...new Set(finishIndexes)]
        .map(getPrimes);
    const setOfNums = map
        .map(primes =>
            primes.reduce((acc, num) => {
                acc[num]++;
                return acc
            }, new Array(294).fill(0))
        );

    let reduce = setOfNums
        .reduce((acc, curr) => {
            curr.forEach((c, i) => {
                // deno-lint-ignore no-prototype-builtins
                if ((!acc.hasOwnProperty(i) && c > 0) || acc[i] < c) {
                    acc[i] = c
                }
            })
            return acc;
        }, {} as Record<number, number>);
    console.log(Object.entries(reduce).map(([c, i]) => `${c} occurs ${i} times`))
    return Object.entries(reduce)
        .reduce((acc, [curr, i]) => {
            let c = parseInt(curr)
            return (c === 0) ? acc : acc * (c * i)
        }, 1);
}

const test3: Input = [`LR`, `11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`]

console.log(getPrimes(2))
console.log(getPrimes(18))
console.log(getPrimes(20803))
console.log(getPrimes(17873))
console.log(getPrimes(23147))
console.log(getPrimes(15529))
console.log(getPrimes(17287))
console.log(getPrimes(19631))

assertEquals(part1(test), 2)
assertEquals(part1(test2), 6)
assertEquals(part1(input), 19631)
assertEquals(part2(test3), 6)
assertNotEquals(part2(input), 71683294841) // too low
assertEquals(part2(input), 71683294841) // too low

// run with `deno run -A solutions/dayX.ts`

