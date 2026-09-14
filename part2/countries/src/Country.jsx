export function Coutries({ countires }) {
    if(countires.length > 10)
        return <p>Too many matches, specify another filter.</p>
}