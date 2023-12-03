
const test = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`

const test2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`

const input = await Deno.readTextFile("inputs/input1.txt");

const part1 = (input: string): number => {
    return parseNumbers(input)
        .filter(line => line.length > 0)
        .map(line => line[0]*10+line[line.length-1])
        .reduce((acc, curr) => acc + curr, 0)
}

const parseNumbers = (input: string): Array<Array<number>> => {
    return input
        .split('\n')
        .map(line => line
            .split('')
            .map(c => parseInt(c,10))
            .filter(n => !isNaN(n)))
}

const parseNumbers2 = (input: string): Array<Array<number>> => {
    return input
        .split('\n')
        .map(line => line
            .replaceAll("one", "one1one")
            .replaceAll("two", "two2two")
            .replaceAll("three", "three3three")
            .replaceAll("four", "four4four")
            .replaceAll("five", "five5five")
            .replaceAll("six", "six6six")
            .replaceAll("seven", "seven7seven")
            .replaceAll("eight", "eight8eight")
            .replaceAll("nine", "nine9nine")
            .replaceAll("zero", "zero0zero")
            .split('')
            .map(c =>
                parseInt(c,10))
            .filter(n => !isNaN(n)))
}

const part2 = (input:string): number => {
    return parseNumbers2(input)
        .filter(line => line.length > 0)
        .map(line => line[0]*10+line[line.length-1])
        // .map((line)=> {console.log(line); return line})
        .reduce((acc, curr) => acc + curr, 0)
}


// console.log(part1(test))
// console.log(part1(input))
console.log(part2(test2))
console.log(part2("nine8foursnczninednds"))
console.log(part2(input))

// run with `deno run -A solutions/day1.ts`
