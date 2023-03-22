function CheckBox({ type, filterHandler }) {
  return (
    <label htmlFor={type}>
      <input type="checkbox" onChange={filterHandler} value={type} id={type} />
      <span>{type}</span>
    </label>
  );
}
export default CheckBox;
