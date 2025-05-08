import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getRecommendedProfiles,
  getAllProfiles,
  followUser,
  unfollowUser,
} from "../../../config/redux/action/authAction";
import styles from "./Style.module.css";
import { BASE_URL } from "../../../config";

const UserPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get("type");
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const authState = useSelector((state) => state.auth);
  const { recommendProfiles = [], allProfiles = [] } = authState;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    if (userId) {
      if (type === "suggested") {
        dispatch(getRecommendedProfiles(userId));
      } else if (type === "populer") {
        dispatch(getAllProfiles());
      }
    }
  }, [type, userId, dispatch]);

  const handleFollowToggle = async (id, isFollowing) => {
    if (isFollowing) {
      await dispatch(unfollowUser({ userId, id }));
    } else {
      await dispatch(followUser({ userId, id }));
    }
    dispatch(getAllProfiles());
    dispatch(getRecommendedProfiles(userId));
  };

  const rawProfiles =
    type === "suggested"
      ? recommendProfiles
      : allProfiles.filter((profile) => profile.user._id !== userId);

  const filteredProfiles = rawProfiles
    .filter((profile) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        profile.user.name.toLowerCase().includes(searchLower) ||
        profile.user.username?.toLowerCase().includes(searchLower) ||
        profile.course?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (filterBy === "most_followed") {
        return b.user.followers.length - a.user.followers.length;
      }
      return 0;
    })
    .filter((profile) => {
      if (filterBy === "all" || filterBy === "most_followed") return true;

      const course = profile.course?.toLowerCase().trim();

      if (filterBy === "") {
        return !course || course === "";
      }

      return course === filterBy.toLowerCase().trim();
    });

  return (
    <div className={styles.profileWrapper}>
      <h2 className={styles.profileHeading}>
        {type === "suggested" ? "Suggested Profiles" : "Popular Profiles"}
      </h2>

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
          <option value="most_followed">Most Followed</option>
          <option value="B.Sc Computer Science">B.Sc Computer Science</option>
          <option value="MCA">MCA</option>
          <option value="MSc Cyber Security">MSc Cyber Security</option>
        </select>
      </div>

      {filteredProfiles.length === 0 ? (
        <p className={styles.noProfiles}>No profiles found.</p>
      ) : (
        <div className={styles.profileGrid}>
          {filteredProfiles.map((profile) => {
            const isFollowing = profile.user?.followers?.includes(userId);
            return (
              <div key={profile._id} className={styles.profileCardWrapper}>
                <div
                  className={styles.profileCard}
                  onClick={() => {
                    navigate(`/my_profile/${profile.user._id}`);
                  }}
                >
                  {type === "suggested" && (
                    <div className={styles.matchBadge}>
                      {profile.match_percentage || 0}%
                    </div>
                  )}
                  {profile.user.profilePicture && (
                    <img
                      src={`${BASE_URL}uploads/${profile.user.profilePicture}`}
                      alt={profile.fullName}
                      className={styles.profileImage}
                    />
                  )}
                  <div className={styles.cardContent}>
                    <h5 className={styles.profileName}>{profile.user.name}</h5>
                    <p className={styles.followers}>
                      {profile.user.followers.length} Followers
                    </p>
                    <button
                      className={`${
                        isFollowing ? styles.unfollowBtn : styles.followBtn
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowToggle(profile.user._id, isFollowing);
                      }}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserPage;
