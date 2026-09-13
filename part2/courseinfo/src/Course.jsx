import { Header } from "./Header";
import { Content } from "./Content";

export function Course({ course }) {
    return (
        <>
            <Header courseName={course.name} />
            <Content parts={course.parts}/>
        </>
    )
}