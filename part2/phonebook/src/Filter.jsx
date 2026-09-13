export function Filter({ handleSearch, filter }) {
    return (
        <form>
            <div>
                filter shown with: <input onChange={handleSearch} value={filter} />
            </div>
        </form>
    )
}