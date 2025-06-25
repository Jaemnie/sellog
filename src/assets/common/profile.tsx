import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faArrowLeft, faLock } from "@fortawesome/free-solid-svg-icons";
import { faLockOpen, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../contexts/AuthContext";
import { profile } from "../../api";

const Profile = () => {
  const navigate = useNavigate();
  const [selected, setselected] = useState<"left" | "right">("left");
  const [lock, unlock] = useState(false);
  const userId = localStorage.getItem("userId");

  const [nickname, setNickname] = useState("");

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="profile-box">
      <div className="profile-header">
        <button onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="profile-icon" />
        </button>
        <div className="profile-userid">{userId}</div>
        <button type="button" onClick={() => unlock((prev) => !prev)}>
          <FontAwesomeIcon
            className="profile-icon ml-4"
            icon={lock ? faUnlock : faLockOpen}
          />
        </button>
      </div>
      <div className="profile-info">
        <img
          className="profile-img"
          src="https://placehold.co/600x400.png"
        ></img>
        <div className="profile-count">
          <span>
            <div>16</div>
            <div className="profile-count-text">게시글</div>
          </span>
          <span>
            <div>7</div>
            <div className="profile-count-text">중고거래</div>
          </span>
          <span>
            <div>34</div>
            <div className="profile-count-text">팔로워</div>
          </span>
          <span>
            <div>27</div>
            <div className="profile-count-text">팔로우</div>
          </span>
        </div>
      </div>
      <div className="profile-sell">
        <div>후기후기후기후기휘기후기1</div>
        <div>후기후기후기후기휘기후기2</div>
        <div>후기후기후기후기휘기후기3</div>
      </div>
      <div className="profile-feed-box">
        <div className="flex">
          <button
            onClick={() => setselected("left")}
            className={`profile-btn-left ${
              selected === "left" ? "bg-[var(--color-primary)]" : "bg-white"
            }`}
          >
            일상 피드 ▼
          </button>
          <button
            onClick={() => setselected("right")}
            className={`profile-btn-right ${
              selected === "right" ? "bg-[var(--color-primary)]" : "bg-white"
            }`}
          >
            거래 피드 ▼
          </button>
        </div>
        <div className="profile-feed">
          {selected === "left" && <div>일상</div>}
          {selected === "right" && <div>거래</div>}
        </div>
      </div>
    </div>
  );
};
export default Profile;
