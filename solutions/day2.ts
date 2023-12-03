import {assert, assertEquals} from "https://deno.land/std@0.208.0/assert/mod.ts";

const test = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`


const input = await Deno.readTextFile("inputs/input2.txt");

enum Color {
    blue,
    red,
    green,
}

type Colors = { amount: number, color: Color }
type Hand = Colors[]
type Game = {
    id: number,
    hands: Hand[]
}
type Game2 = {
    id: number,
    colors: Colors[]
}

function getColor(c: string) {
    switch (c) {
        case 'red':
            return Color.red
        case 'blue':
            return Color.blue
        case 'green':
            return Color.green
        default:
            throw Error(`unable to parse color ${c}`)
    }
}

const parseHand = (input: string): Colors[][] => {
    return input
        .split('; ')
        .map(line => line
            .split(', ')
            .map(colorHand => {
                const color = colorHand.split(' ');
                // console.log(`parsing}`, color)
                return {
                    amount: parseInt(color[0]),
                    color: getColor(color[1])
                }
            })
        )
}

function isValidColor(color: Colors): boolean {
    return !((color.color === Color.red && color.amount > 12) ||
        (color.color === Color.green && color.amount > 13) ||
        (color.color === Color.blue && color.amount > 14));
}

function areValidHands(hands: Hand[]): boolean[] {
    return hands.map(hand =>
        isValidHand(hand)
    )
}

function isValidHand(hand: Hand): boolean {
    return hand
        .map(color => {
            const isvalid = isValidColor(color);
            // console.log(`color ${JSON.stringify(color)} is ${isvalid ? '' : 'in'}valid`)
            return isvalid
        })
        .reduce((acc, curr) => acc && curr, true)
}

function areValidGames(parsed: Game[]): Game[] {
    return parsed
        .filter(game => {
                return areValidHands(game.hands)
                    .reduce((acc, curr) => acc && curr, true)
            }
        );
}

function parseInput(input: string): Game[] {
    return input
        .split('\n')
        .filter(line => line.length > 0)
        .map(line => {
            const match = line.match(/Game (\d+): (.*)/);
            if (match && match.length > 1)
                return {
                    id: parseInt(match[1]),
                    hands: parseHand(match[2])
                }
            else {
                throw Error('regex error')
            }
        })
        .filter(game => game !== undefined);
}

const part1 = (input: string): number => {
    const parsed: Game[] = parseInput(input);

    return areValidGames(parsed)
        .reduce((acc, curr) => {
            // console.log(`validGame ${curr.id} is valid`)
            return acc + curr.id
        }, 0)
}

const part2 = (input: string): number => {
    const parsed: Game[] = parseInput(input);
    const game2parsed: Game2[] = parsed.map(game => ({
        id: game.id,
        colors: game.hands.flatMap(hand => hand)
    }));

    return game2parsed
        .reduce((acc, curr) => {
                const numbers = curr.colors
                        .filter(color => color.color === Color.red)
                        .reduce((cacc, ccurr) => cacc < ccurr.amount ? ccurr.amount : cacc, 0) *
                    curr.colors
                        .filter(color => color.color === Color.green)
                        .reduce((cacc, ccurr) => cacc < ccurr.amount ? ccurr.amount : cacc, 0) *
                    curr.colors
                        .filter(color => color.color === Color.blue)
                        .reduce((cacc, ccurr) => cacc < ccurr.amount ? ccurr.amount : cacc, 0);
                return acc + numbers;
            },
            0);
}


assert(isValidColor({amount: 13, color: Color.green}))
assert(!isValidColor({amount: 14, color: Color.green}))
assert(!isValidColor({amount: 13, color: Color.red}))
assert(isValidColor({amount: 12, color: Color.red}))
assert(!isValidColor({amount: 14, color: Color.green}))


console.log('result 1', part1(input))
console.log('result 2', part2(input))

const validHandVal = {amount: 12, color: Color.red};
assertEquals(isValidHand([validHandVal]), true)
assertEquals(areValidHands([[validHandVal]]), [true])
const validGame = {id: 1, hands: [[validHandVal]]};
assertEquals(areValidGames([validGame]), [validGame])

const invalidHand = {amount: 120, color: Color.red};
assertEquals(isValidHand([invalidHand]), false)
assertEquals(areValidHands([[invalidHand]]), [false])
assertEquals(areValidGames([{id: 1, hands: [[invalidHand]]}]), [])


assertEquals(part1(test), 8)
assertEquals(part1(input), 2913)
assertEquals(part2(test), 2286)


// run with `deno run -A solutions/day2.ts`
