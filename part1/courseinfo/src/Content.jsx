import { Part } from "./Part"

export function Content(props) {
    return (
        <>
            <Part 
                part={props.part1}
            />
            <Part 
                part={props.part2}
            />
            <Part 
                part={props.part3}
            />
        </>
    )
}