import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getMyProfile } from "../../api/profile";
import type { MyProfileInfo } from "../../api/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  faLockOpen,
  faUnlock,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
const Profile = () => {
  const navigate = useNavigate();
  const [selected, setselected] = useState<"left" | "right">("left");
  const [lock, unlock] = useState(false);
  const userId = localStorage.getItem("userId");

  const [nickname, setNickname] = useState("");
  const [profileData, setProfileData] = useState<MyProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const goBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyProfile();

        if (response.isSuccess && response.payload) {
          setProfileData(response.payload);
        } else {
          setError(response.message || "프로필을 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error("프로필 로딩 실패:", err);
        setError("프로필을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  if (loading) {
    return (
      <div className="profile-box">
        <div className="profile-header">
          <button onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} className="profile-icon" />
          </button>
          <div className="profile-header-text">로딩 중...</div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div>프로필을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-box">
        <div className="profile-header">
          <button onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} className="profile-icon" />
          </button>
          <div className="profile-header-text">오류</div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-box">
      <div className="profile-header">
        <button onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="profile-icon" />
        </button>
        <div className="profile-header-text">
          {profileData?.nickname || nickname}
        </div>
        <button type="button" onClick={() => unlock((prev) => !prev)}>
          <FontAwesomeIcon
            className="profile-icon ml-4"
            icon={lock ? faUnlock : faLockOpen}
          />
        </button>
      </div>
      <div className="profile-info">
        <img
          className="profile-img mr-4"
          src={profileData?.profileURL || "https://placehold.co/600x400.png"}
          alt="프로필 이미지"
        />
        <div className="profile-count">
          <span>
            <div>{profileData?.postCount || 0}</div>
            <div className="profile-count-text">게시글</div>
          </span>
          <span>
            <div>{profileData?.productCount || 0}</div>
            <div className="profile-count-text">중고거래</div>
          </span>
          <span>
            <div>{profileData?.followedCount || 0}</div>
            <div className="profile-count-text">팔로워</div>
          </span>
          <span>
            <div>{profileData?.followCount || 0}</div>
            <div className="profile-count-text">팔로우</div>
          </span>
        </div>
      </div>
      <div className="profile-sell-box">
        <div className="profile-sell">
          {profileData?.profileMessage ? (
            <div>{profileData.profileMessage}</div>
          ) : (
            <div>프로필 메시지가 없습니다.</div>
          )}
        </div>
        <button
          className="profile-setting"
          onClick={() => navigate("/myprofile")}
        >
          <FontAwesomeIcon icon={faGear} className="profile-icon" />
        </button>
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
