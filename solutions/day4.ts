import {assertEquals} from "https://deno.land/std@0.208.0/assert/assert_equals.ts";
import {assertNotEquals} from "https://deno.land/std@0.208.0/assert/assert_not_equals.ts";

const test = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

const input = await Deno.readTextFile("inputs/input4.txt");

const part1 = (input: string): number => {
    return input.split('\n')
        .filter(line => line.length > 0)
        .map(line => {
                const [cardNr, rest] = line.split(':')
                const [wins, myNumbers] = rest.split(' | ').map(line => line.split(/\s+/).map(nr => parseInt(nr, 10)).filter(nr => !isNaN(nr)))
                let length = myNumbers.filter(nr => wins.includes(nr)).length;
                return length === 0 ? 0 : Math.pow(2, length - 1)
            }
        ).reduce((a, c) => a + c, 0)
}

const part2 = (input: string): number => {
    let lines = input.split('\n')
        .filter(line => line.length > 0);
    const res: number[] = new Array(lines.length).fill(1);
    lines
        .forEach((line, index) => {
                const [card, rest] = line.split(':')
                const cardNr = parseInt(card.replace(/Card\s+(\d+)/, '$1'))
                const [wins, myNumbers] = rest.split(' | ').map(line => line.match(/\d+/g)!.map(Number))
                const length = myNumbers.filter(nr => wins.includes(nr)).length;
                const cardTimes = res[cardNr - 1];
                for (let i = index+1; i <= index + length; i++) {
                    res[i] += res[index]
                }
            }
        )
    return res.reduce((a, c) => a + c, 0);
}


assertEquals(part1(test), 13)
assertEquals(part1(input), 19135)
assertEquals(part2(test), 30)
assertNotEquals(part2(input), 2848152) // too low
assertEquals(part2(input), 5704953)


// run with `deno run -A solutions/day4.ts`
