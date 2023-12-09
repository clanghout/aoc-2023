
import {assertEquals} from "https://deno.land/std@0.208.0/assert/assert_equals.ts";

const test = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

const input = await Deno.readTextFile("inputs/input9.txt");

const parseInput = (input: string): number[][] => {
    return input.split('\n')
    .filter(l => l.length > 0)
    .map(n => n.split(' ').map(Number));
};

const getDistances = (sequence: number[]): number[] => {
    return sequence.reduce((acc, curr, i, arr) => {
        if (i === arr.length-1) {
            return acc
        }
      const diffWithNext = arr[i + 1] - curr;
        acc.push(diffWithNext)
        return acc
    }, [] as number[])
};

const getAllDistances = (s: number[]): number[][] => {
    const distances = [s]
        let newDistances = getDistances(s)
        while (newDistances.find(n => n !== 0)) {
            distances.push(newDistances)
        
            newDistances = getDistances(newDistances)
        }
        distances.push([0])
        return distances
}


const part1 = (input: string): number => {
    let sequences = parseInput(input)

    return sequences.reduce((acc ,s: number[]) => {
        const distances = getAllDistances(s)
        // console.log({distances})
        let res = 0;
        for (let i = distances.length-2; i >= 0; i--) {  
            const distanceToAdd: number = distances[i + 1].pop()! + distances[i][distances[i].length-1];
            // console.log(`next adding ${distanceToAdd} for`, distances[i])
            distances[i].push(distanceToAdd)
            res = distanceToAdd;
        }
        return acc + res;
    },0);
}

const part2 = (input:string): number => {
    const sequences = parseInput(input)

    return sequences.reduce((acc ,s: number[]) => {
        const distances = getAllDistances(s)
        let res = 0;
        for (let i = distances.length-2; i >= 0; i--) {  
            const curVal = distances[i + 1].shift()!
            const theDistance = distances[i][0]
            const distanceToRemove: number = theDistance - curVal;
            // console.log(`next subrtracti ${theDistance} - ${curVal} = ${distanceToRemove} for`, distances[i])
            distances[i].unshift(distanceToRemove)
            res = distanceToRemove;
        }
        return acc + res;
    },0);
}


assertEquals(part1(test), 114)
assertEquals(part1(input), 1980437560)
assertEquals(part2(test), 2)
assertEquals(part2(input), 977)

// run with `deno run -A solutions/dayX.ts`
