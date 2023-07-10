import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal.js";
import { useHistory } from "react-router-dom";
import { thunkDeleteGroup } from "../../store/groups";
import "./DeleteGroup.css";

const DeleteGroup = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const group = useSelector((state) => state.groups.singleGroup);
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("Deleting group:", group);
    dispatch(thunkDeleteGroup(group.id));
    closeModal();
    history.push("/groups");
  };

  return (
    <div className="delete-group-modal">
      <h1 className="delete-group-modal-title">Confirm Delete</h1>
      <span className="message">
        Are you sure you want to remove this group?
      </span>
      <div className="delete-group-modal-buttons">
        <button className="yes" onClick={handleDelete}>
          Yes (Delete Group)
        </button>
        <button className="no" onClick={closeModal}>
          No (Keep Group)
        </button>
      </div>
    </div>
  );
};

export default DeleteGroup;