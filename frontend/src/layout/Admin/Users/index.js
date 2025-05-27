import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUserCount,
  blockAndUnblockUser,
} from "../../../config/redux/action/adminAction";
import styles from "./Style.module.css";
import { BASE_URL } from "../../../config";

const UserPage = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const isAdmin = user?.type === "admin";
  const adminState = useSelector((state) => state.admin);
  const { userCount = {} } = adminState;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    if (isAdmin) {
      dispatch(getUserCount());
    }
  }, [dispatch, isAdmin]);

  const users = userCount?.users || [];

  const filteredUsers = users
    .filter((u) => {
      const searchLower = searchTerm.toLowerCase();
      const course = u.profileData?.course || "";

      return (
        u.name.toLowerCase().includes(searchLower) ||
        u.username?.toLowerCase().includes(searchLower) ||
        course.toLowerCase().includes(searchLower)
      );
    })
    .filter((u) => {
      if (filterBy === "all") return true;
      if (filterBy === "blocked") return u.blocked === true;
      if (filterBy === "unblocked") return u.blocked === false;
      if (!filterBy) return !u.profileData?.course;

      return (
        (u.profileData?.course || "").toLowerCase().trim() ===
        filterBy.toLowerCase().trim()
      );
    });

  const handleBlockToggle = (userId) => {
    dispatch(blockAndUnblockUser(userId)).then(() => {
      dispatch(getUserCount());
    });
  };

  return (
    <div className={styles.profileWrapper}>
     <h2 className={styles.heading}>Users</h2>

      <div className={styles.filterControls}>
        <input
          type="text"
          placeholder="Search by name, username or course"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All</option>
          <option value="B.Sc Computer Science">B.Sc Computer Science</option>
          <option value="MCA">MCA</option>
          <option value="MSc (Cyber Security)">MSc (Cyber Security)</option>
          <option value="blocked">Blocked Users</option>
          <option value="unblocked">Unblocked Users</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <p className={styles.noProfiles}>No User found.</p>
      ) : (
        <div className={styles.profileGrid}>
          {filteredUsers.map((u) => (
            <div key={u._id} className={styles.profileCardWrapper}>
              <div
                className={styles.profileCard}
                onClick={() =>
                  navigate(`/admin/user-profile/detail/${u.profileData?._id}`)
                }
              >
                {u.profilePicture && (
                  <img
                    src={`${BASE_URL}uploads/${u.profilePicture}`}
                    alt={u.name}
                    className={styles.profileImage}
                  />
                )}
                <div className={styles.cardContent}>
                  <h5 className={styles.profileName}>{u.name}</h5>
                  <p className={styles.course}>
                    {u.profileData?.course || "Course not specified"}
                  </p>
                </div>

                {isAdmin && (
                  <button
                    className={`${styles.blockBtn} ${
                      u.blocked ? styles.unblock : styles.block
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlockToggle(u._id);
                    }}
                  >
                    {u.blocked ? "Unblock" : "Block"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPage;
