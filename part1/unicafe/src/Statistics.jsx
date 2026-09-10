import { StatisticLine } from "./StatisticLine";

export function Statistics(props) {
    const total = props.good + props.neutral + props.bad;
    const avg = total === 0 ? 0 : (props.good * 1 + props.neutral * 0 + props.bad * (-1)) / total;
    const positive = total === 0 ? `0%` : `${props.good / total * 100}%`;

    return (
        <>
            {total !== 0 ? (
                <table>
                    <tbody>

                        <StatisticLine
                            text="good"
                            value={props.good}
                        />
                        <StatisticLine
                            text="neutral"
                            value={props.neutral}
                        />
                        <StatisticLine
                            text="bad"
                            value={props.bad}
                        />
                        <StatisticLine
                            text="all"
                            value={total}
                        />
                        <StatisticLine
                            text="average"
                            value={avg}
                        />
                        <StatisticLine
                            text="positive"
                            value={positive}
                        />
                    </tbody>
                </table>
            ) : (
                <p>No feedback is given</p>
            )}
        </>
    )
}