import { useState, useImperativeHandle } from "react";

export function Togglable(props) {
    const [visible, setVisible] = useState(false);

    const hiddenWhenVisible = { display: visible ? 'none' : ''}
    const shownWhenVisible = { display: visible ? '' : 'none'}

    useImperativeHandle(props.ref, () => {
        return { toggleVisibility }
    });

    const toggleVisibility = () => setVisible(!visible);

    return (
        <>
            <div style={hiddenWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={shownWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>Cancel</button>
            </div>
        </>
    )
}