export function Statistics(props) {
    const total = props.good + props.neutral + props.bad;
    const avg = total === 0 ? 0 : (props.good * 1 + props.neutral * 0 + props.bad * (-1)) / total;
    const positive = total === 0 ? `0%` : `${props.good / total * 100}%`;

    return (
        <>
            {total !== 0 ? (
                <>
                    <p>good {props.good}</p>
                    <p>neutral {props.neutral}</p>
                    <p>bad {props.bad}</p>
                    <p>all {total}</p>
                    <p>average {avg}</p>
                    <p>positive {positive}</p>
                </>
            ) : (
                <p>No feedback is given</p>
            )}
        </>
    )
}