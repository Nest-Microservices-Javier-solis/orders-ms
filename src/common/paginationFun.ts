export const paginationConfig = (page: number, take: number) => {
    if (page === 1) {
        return 0
    }
    else {
        return (take! * (page! - 1))
    }
}