interface Serializable<T extends Object> {
  toJSON(): T;
}

export default Serializable;
