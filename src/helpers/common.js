// This is where common helpers resides.

const setKeyToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getKeyFromLocalStorage = (key) => {
  const jsonData = localStorage.getItem(key);
  const data = jsonData ? JSON.parse(jsonData) : null;
  return data;
};

// Remove Items From Local Storage
export const removeItemsFromLocalStorage = (keys) => {
  for (const key of keys) {
    localStorage.removeItem(key);
  }
};

export {setKeyToLocalStorage, getKeyFromLocalStorage};
