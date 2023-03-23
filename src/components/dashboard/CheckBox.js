import "./CheckBox.css";
function CheckBox({ type, filterHandler }) {
  return (
    <label class="container" htmlFor={type}>
      {" "}
      {type}
      <input type="checkbox" onChange={filterHandler} value={type} id={type} />
      <span class="checkmark"></span>
    </label>
  );
}
export default CheckBox;
