import {assertEquals} from "https://deno.land/std@0.208.0/assert/assert_equals.ts";

const test: [number, number][] = [[7, 9], [15, 40], [30, 200]]

// const input = await Deno.readTextFile("inputs/input6.txt");
const input: [number, number][] = [[59, 597], [79, 1234], [65, 1032], [75, 1328]]

const part1 = (input: [number, number][]): number => {
    return input
        .map(([time, distance]) => {
            // -x^2 + time*x - distance)
            // solve where x === 0
            // a = -1 b = time, c = -distance
            let min = Math.ceil((-time + Math.sqrt((Math.pow(time, 2) - 4 * distance))) / (-2))
            let max = Math.floor((-time - Math.sqrt((Math.pow(time, 2) - 4 * distance))) / (-2))
            let number = -Math.pow(min, 2) + time * min;
            // console.log(`min ${min} results in discance ${number}, we need to beat ${distance}`)
            if (number === distance) {
                min += 1
            }
            if (-Math.pow(max, 2) + time * max === distance) {
                max -= 1
            }
            // console.log(`min: ${min} max ${max} diff: ${max-min+1}`)
            return max - min + 1;
        })
        .reduce((acc, curr) => acc * curr, 1)
}

const part2 = (): number => {
    return part1([[59796575, 597123410321328]]);
}


assertEquals(part1(test), 288)
assertEquals(part1(input), 220320)
assertEquals(part2(), 34454850)

// run with `deno run -A solutions/day6.ts`
