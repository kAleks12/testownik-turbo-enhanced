
const getStoredValue = <T,>(keyName: string): T | undefined => {
  try {
    const value = window.localStorage.getItem(keyName);
    if (value) {
      return JSON.parse(value);
    } else {
      return undefined;
    }
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

const setStoredValue = <T,>(keyName: string, newValue: T) => {
  try {
    window.localStorage.setItem(keyName, JSON.stringify(newValue));
  } catch (err) {
    console.log(err);
  }
};

const removeStoredItem = (keyName: string) => {
  try {
    window.localStorage.removeItem(keyName);
  } catch (err) {
    console.log(err);
  }
};

const LocalStorage = {
  getStoredValue,
  setStoredValue,
  removeStoredItem,
};

export default LocalStorage;