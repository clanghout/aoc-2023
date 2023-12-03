import {assertEquals} from "https://deno.land/std@0.208.0/assert/assert_equals.ts";
import {assertNotEquals} from "https://deno.land/std@0.208.0/assert/assert_not_equals.ts";

const test = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

const input = await Deno.readTextFile("inputs/input3.txt");
const range = (start: number, stop: number) => Array.from({length: (stop - start) + 1}, (_, i) => start + (i));

type coord = [x: number, y: number];
type Number = [n: number, c: coord, length: number];
type Numbers = Number[];

const part1 = (input: string): number => {
    const specialChars: { [y: number]: number[] } = {};
    const lines = input
        .split('\n')
        .filter(l => l.length > 0);

    let buffer = '';
    const numbers: Numbers = [];

    function addNumber(x: number, y: number, numbers: Numbers) {
        if (buffer.length > 0) {
            numbers.push([parseInt(buffer), [x, y], buffer.length])
        }
        buffer = ''
    }

    const maxX = lines[0].length - 1;
    const maxY = lines.length - 1;
    lines
        .map((line, y) => {
                addNumber(maxX, y - 1, numbers)
                specialChars[y] = []
                return line
                    .split('')
                    .map((char, x) => {
                            if (['*', '$', '=', '-', '+', '&', '#', '%', '/', '@'].includes(char)) {
                                specialChars[y].push(x)
                                addNumber(x - 1, y, numbers)
                            } else if (char === '.') {
                                addNumber(x - 1, y, numbers)
                            } else {
                                buffer = buffer + char
                            }
                        }
                    )
            }
        )

    return numbers.filter(([_number, [nx, ny], nlength]) => {
        const nStartX = nx - nlength; // first x index to check
        if (ny > 1) {
            /// check above
            if (specialChars[ny - 1].filter(value => range(nStartX, nx + 1).includes(value)).length > 0) {
                return true
            }
        }
        // check own line after
        if (nx < maxX && specialChars[ny].includes(nx + 1)) {
            // check after
            return true
        }
        if (nStartX > 0 && specialChars[ny].includes(nStartX)) {
            // check in front
            return true
        }
        // check below
        if (ny < maxY) {
            if (specialChars[ny + 1].filter(value => range(nStartX, nx + 1).includes(value)).length > 0) {
                return true
            }
        }
        return false
    }).reduce((acc, curr) => acc + curr[0], 0)
}

type NumbersY = { [y: number]: Numbers };
const part2 = (input: string): number => {
    // type Numbers2 = {}
    const stars: { [y: number]: number[] } = {};
    const starCoords: coord[] = [];
    const lines = input
        .split('\n')
        .filter(l => l.length > 0);

    let buffer = '';
    const numbers: Numbers = [];

    const maxX = lines[0].length - 1;
    const maxY = lines.length - 1;

    const numbersY: NumbersY = {};

    function addNumber(x: number, y: number, numbers: Numbers) {
        if (buffer.length > 0) {
            const number = [parseInt(buffer), [x, y], buffer.length] as Number;
            numbers.push(number)
            if (numbersY[y]) {
                numbersY[y].push(number)
            } else {
                numbersY[y] = [number]
            }

        }
        buffer = ''
    }

    lines
        .map((line, y) => {
                addNumber(maxX, y - 1, numbers)
                stars[y] = []
                return line
                    .split('')
                    .map((char, x) => {
                            if (char === '*') {
                                stars[y].push(x)
                                starCoords.push([x, y])
                                addNumber(x - 1, y, numbers)
                            } else if (char === '.') {
                                addNumber(x - 1, y, numbers)
                            } else {
                                // check other special chars
                                if (!isNaN(parseInt(char)))
                                    buffer = buffer + char
                                else {
                                    addNumber(x - 1, y, numbers)
                                }
                            }
                        }
                    )
            }
        )

    return starCoords
        .map(([starx, stary]) => {
            const attached: Set<Number> = new Set<Number>();

            // first x index to check\
            const aboveNumbers = numbersY[stary - 1] || []
            aboveNumbers.filter(
                (([_num, [x, _y], len]) =>
                        // assumption: numbers are length 3 max
                        // number ends in left top
                        (starx - 1) === x ||
                        // number ends middle
                        starx === x ||
                        // number ends right
                        (starx + 1) === x ||
                        // number starts left
                        (starx - 1) === (x - len + 1) ||
                        // number starts mid
                        starx === (x - len + 1) ||
                        // number starts end
                        (starx + 1) === (x - len + 1)
                )
            ).forEach(n => attached.add(n))

            // middle, make 2 sep checks
            const midNumbers = numbersY[stary] || []
            midNumbers.filter(([_n, [x, _y], len]) => x === starx - 1 || (x - len + 1) == starx + 1).forEach(n => attached.add(n))

            // below
            const belowNumbers = numbersY[stary + 1] || []
            belowNumbers.filter(
                (([_num, [x, _y], len]) =>
                        // assumption: numbers are length 3 max
                        // number ends in left top
                        starx - 1 === x ||
                        // number ends middle
                        starx === x ||
                        // number ends right
                        starx + 1 === x ||
                        // number starts left
                        starx - 1 === (x - len + 1) ||
                        // number starts mid
                        starx === (x - len + 1) ||
                        // number starts end
                        starx + 1 === (x - len + 1)
                )
            ).forEach(n => attached.add(n));

            // console.log(`attached to star ${starx} ${stary} are`, attached)
            // if (stary === 1) {
            //     console.log(`star ${starx},${stary}`,attached)
            // }
            return attached
        })
        .filter(attached => attached.size === 2)
        .reduce((acc, curr) => {
            const numbers1 = curr.values();
            let valueElement = numbers1.next().value[0];
            let valueElement1 = numbers1.next().value[0];
            let number = valueElement * valueElement1;
            // console.log(`adding gear ${valueElement} * ${valueElement1}`, number)
            return acc + number;
        }, 0)

}

//
assertEquals(part1(test), 4361)
assertEquals(part1(input), 521601)
assertEquals(part2(test), 467835)
assertNotEquals(part2(input), 65559455)

const test2 = `
..1..114..
...*......
..1...633.
....1.#...
...*......
..2..+.58.
..592.....
...1...55.
...$1*.1...
.664...8..`
assertEquals(part2(test2), 3)

const test3 = `
11111111..
...*......
..1...633.
....1.#...
...*......
..2..+.58.
..592.....
...1...55.
...$1*.1...
.664...8..`
// based on assumption that no longer numbers than 3 exist
assertEquals(part2(test3), 2)
const test4 = `
..111.....
...*......
..1...633.
....1.#...
...*......
..111+.58.
..592.....
...1...55.
...$1*11...
.664...8..`
assertEquals(part2(test4), 233)

const test5 = `
..1.1....
...*......`
assertEquals(part2(test5), 1)

const test6 = `
...*......
..2.3....
`
assertEquals(part2(test6), 6)

const test7 = `
...2*3......
`
assertEquals(part2(test7), 6)

const test8 = `
....*0001.......
...2*.3......
...3*.3......
`
assertEquals(part2(test8), 8)

const test9 = `
......161.683....
..633*....*......
.......659.......
.................
`
assertEquals(part2(test9), 683*659 + 161*633)
//
assertNotEquals(part2(input), 74205321)
assertNotEquals(part2(input), 76077622)
assertEquals(part2(input), 80694070)

// run with `deno run -A solutions/dayX.ts`
