import {assertEquals} from "https://deno.land/std@0.208.0/assert/assert_equals.ts";
import { assertNotEquals } from "https://deno.land/std@0.208.0/assert/assert_not_equals.ts";
import { input } from '../inputs/input7.js'

const test = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`

const cardValues: { [key: string]: number } = {
    "A": 14,
    "K": 13,
    "Q": 12,
    "J": 11,
    "T": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
}

const cardStringValues: { [key: string]: string } = {
    "A": "e",
    "K": "d",
    "Q": "c",
    "J": "b",
    "T": "a",
    "9": "9",
    "8": "8",
    "7": "7",
    "6": "6",
    "5": "5",
    "4": "4",
    "3": "3",
    "2": "2",
}
const specialScores = {
    fiveoak: 7,
    fouroak: 6,
    fullHouse: 5,
    threeoak: 4,
    twopair: 3,
    pair: 2,
    highCard: 1,
}

// const input = await Deno.readTextFile("inputs/input7.txt");

function getHandType(hand: number[]): number {
    const counts = hand.reduce((acc, curr) => {
        acc[curr]++
        return acc
    }, new Array(15).fill(0))

    const sortedCounts = counts.sort().reverse();

    if (sortedCounts[0] === 5) {
        return specialScores.fiveoak
    }
    if (sortedCounts[0] === 4) {
        return specialScores.fouroak
    }
    if (sortedCounts[0] === 3) {
        if (sortedCounts[1] === 2) {
            return specialScores.fullHouse
        }
        return specialScores.threeoak
    }
    if (sortedCounts[0] === 2) {
        if (sortedCounts[1] === 2) {
            return specialScores.twopair
        }
        return specialScores.pair
    }
    return specialScores.highCard
}

function getHandTypeWithJokers(hand: number[]): number {
    const counts = hand.reduce((acc, curr) => {
        acc[curr]++
        return acc
    }, new Array(15).fill(0))

    const jokerIndex = cardValues["J"];
    const jokerCount = jokerIndex >= 0 ? counts.splice(jokerIndex,1)[0] : 0;

    const sortedCounts = counts.sort().reverse();

    if (sortedCounts[0] === 5 || jokerCount === 5) {
        return specialScores.fiveoak
    }
    if (sortedCounts[0] === 4) {
        if (jokerCount === 1) {
            return specialScores.fiveoak
        }
        return specialScores.fouroak
    }
    if (sortedCounts[0] === 3) {
        if (sortedCounts[1] === 2) {
            if (jokerCount === 2) {
                return specialScores.fiveoak
            }
            return specialScores.fullHouse
        }
        if (jokerCount === 2) {
            return specialScores.fiveoak
        }
        if (jokerCount === 1) {
            return specialScores.fouroak
        }
        return specialScores.threeoak
    }
    if (sortedCounts[0] === 2) {
        if (sortedCounts[1] === 2) {
            if (jokerCount === 1) {
                return specialScores.fullHouse
            }
            return specialScores.twopair
        }
        if (jokerCount === 3) {
            return specialScores.fiveoak
        }
        if (jokerCount === 2) {
            return specialScores.fouroak
        }
        if (jokerCount === 1) {
            return specialScores.threeoak
        }
        return specialScores.pair
    }
    if (jokerCount === 4) {
        return specialScores.fiveoak
    }
    if (jokerCount === 3) {
        return specialScores.fouroak
    }
    if (jokerCount === 2) {
        return specialScores.threeoak
    }
    if (jokerCount === 1) {
        return specialScores.pair
    }
    return specialScores.highCard
}

type Hand = { cards: number[]; cardString: string[]; bid: number };

type handTypeFN = (a: number[]) => number;
const compareFn = (getHandType: handTypeFN) => (hand1: Hand, hand2: Hand) => {
    const h1type = getHandType(hand1.cards);
    const h2type = getHandType(hand2.cards);
    if (h1type > h2type) {
        return 1
    }
    if (h1type < h2type) {
        return -1
    }
    return hand1.cardString.join('') > hand2.cardString.join('') ? 1 : -1
};
const part1 = (input: string): number => {
    const hands = parseHands(input, cardStringValues)
    hands.sort(compareFn(getHandType))
    // console.log(hands)
    return hands
        .map((hand, i) => hand.bid * (i+1))
        .reduce((acc, curr) => acc + curr, 0);
}

const cardStringValues2: { [key: string]: string } = {
    "A": "e",
    "K": "d",
    "Q": "c",
    "J": "1",
    "T": "a",
    "9": "9",
    "8": "8",
    "7": "7",
    "6": "6",
    "5": "5",
    "4": "4",
    "3": "3",
    "2": "2",
}

function parseHands(input: string, csv: { [p: string]: string }) {
    return input
        .split('\n')
        .filter(l => l.length > 0)
        .map(hand => {
            const split = hand.split(' ')
            return {
                cardString: split[0].split('').map(c => csv[c]),
                cards: split[0].split('').map(card => cardValues[card]),
                bid: parseInt(split[1], 10)
            }
        });
}

const part2 = (input: string): number => {
    const hands = parseHands(input, cardStringValues2)
    hands.sort(compareFn(getHandTypeWithJokers))
    // console.log(hands)
    return hands
        .map((hand, i) => hand.bid * (i+1))
        .reduce((acc, curr) => acc + curr, 0);

}

const test2 = `
99998 2
999T9 5`

const testJ = `
2JJJJ 2
999T9 5`

assertEquals(getHandTypeWithJokers([2,3,4,5,11]), specialScores.pair)

assertEquals(getHandTypeWithJokers([2,3,4,11,11]), specialScores.threeoak)
assertEquals(getHandTypeWithJokers([2,2,4,7,11]), specialScores.threeoak)

assertEquals(getHandTypeWithJokers([2,3,11,11,11]), specialScores.fouroak)
assertEquals(getHandTypeWithJokers([2,3,2,11,11]), specialScores.fouroak)
assertEquals(getHandTypeWithJokers([2,3,2,2,11]), specialScores.fouroak)

assertEquals(getHandTypeWithJokers([2,11,11,11,11]), specialScores.fiveoak)
assertEquals(getHandTypeWithJokers([2,2,11,11,11]), specialScores.fiveoak)
assertEquals(getHandTypeWithJokers([2,2,2,11,11]), specialScores.fiveoak)
assertEquals(getHandTypeWithJokers([2,2,2,2,11]), specialScores.fiveoak)

assertEquals(getHandTypeWithJokers([2,2,3,3,11]), specialScores.fullHouse)




assertEquals(part1(test), 6440)
assertEquals(part1(test2), 12)
assertNotEquals(part1(input), 251163812)
assertEquals(part1(input), 250951660)
assertEquals(part2(testJ), 9)
assertEquals(part2(test), 5905)
assertNotEquals(part2(input), 251442953) // too low
assertNotEquals(part2(input), 251156055) // has to be higher than the other one

// bug was not using the new cardStringValues map for part 2
assertEquals(part2(input), 251481660)


// run with `deno run -A solutions/dayX.ts`
