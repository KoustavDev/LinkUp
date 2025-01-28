const useGetLocalStorage = () => {
    const getLocalStorage = (key: string) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    };
    
    return { getLocalStorage };
}

export default useGetLocalStorage;