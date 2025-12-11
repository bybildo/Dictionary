export const getLocalStorageSizeInKB = () => {
    let total = 0;
    for (let key in localStorage) {
        if (!localStorage.hasOwnProperty(key)) continue;
        let value = localStorage.getItem(key);
        total += key.length + value.length;
    }
    return (total * 2) / 1024;
}